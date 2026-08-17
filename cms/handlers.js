import crypto from 'node:crypto'
import { createStore } from './store.js'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12
const DEV_CREDS = { username: 'livraison91', code: 'Express91!' }

function sessionSecret() {
  return process.env.CMS_SESSION_SECRET || (process.env.NETLIFY ? '' : 'dev-session-secret')
}

function signToken(secret) {
  const exp = Date.now() + TOKEN_TTL_MS
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

function validToken(token, secret) {
  if (!token || !secret) return false
  const [payload, sig] = String(token).split('.')
  if (!payload || !sig) return false
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  if (!crypto.timingSafeEqual(a, b)) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return Number(data.exp) > Date.now()
  } catch {
    return false
  }
}

export function createCms({ root, defaultContent } = {}) {
  let storePromise

  function store() {
    if (!storePromise) storePromise = createStore({ root, defaultContent })
    return storePromise
  }

  async function resolveCreds() {
    const saved = await (await store()).getCreds()
    if (saved?.username && saved?.code) return saved
    if (process.env.CMS_USERNAME && process.env.CMS_PASSWORD) {
      return { username: process.env.CMS_USERNAME, code: process.env.CMS_PASSWORD }
    }
    if (process.env.NETLIFY) return { username: '', code: '' }
    return DEV_CREDS
  }

  async function readBody(req) {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body
    if (typeof req.body === 'string' && req.body) {
      try {
        return JSON.parse(req.body)
      } catch {
        return {}
      }
    }
    const chunks = []
    if (req[Symbol.asyncIterator]) {
      for await (const c of req) chunks.push(c)
    }
    const raw = Buffer.concat(chunks.map((c) => (Buffer.isBuffer(c) ? c : Buffer.from(c)))).toString('utf8')
    if (!raw) return {}
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }

  function send(res, status, data) {
    if (res.headersSent) return
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
    }
    res.statusCode = status
    const payload = JSON.stringify(data)
    if (typeof res.end === 'function') res.end(payload)
  }

  function bearer(req) {
    const headers = req.headers || {}
    const h = headers.authorization || headers.Authorization || ''
    if (String(h).startsWith('Bearer ')) return String(h).slice(7)
    const cookie = headers.cookie || headers.Cookie || ''
    const m = String(cookie).match(/(?:^|;\s*)lx_session=([^;]+)/)
    return m ? decodeURIComponent(m[1]) : ''
  }

  async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost')
    const p = url.pathname.replace(/\/$/, '') || '/'
    const secret = sessionSecret()

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      if (typeof res.end === 'function') res.end()
      return true
    }

    if (p === '/api/login' && req.method === 'POST') {
      const body = await readBody(req)
      const creds = await resolveCreds()
      const user = String(body.username || '').trim()
      const code = String(body.code || '')
      if (!creds.username || user !== creds.username || code !== creds.code) {
        send(res, 401, { ok: false, error: 'Identifiants incorrects.' })
        return true
      }
      if (!secret) {
        send(res, 500, { ok: false, error: 'CMS_SESSION_SECRET manquant.' })
        return true
      }
      send(res, 200, { ok: true, token: signToken(secret) })
      return true
    }

    if (p === '/api/session' && req.method === 'GET') {
      send(res, 200, { ok: validToken(bearer(req), secret) })
      return true
    }

    if (p === '/api/content' && req.method === 'GET') {
      try {
        const content = await (await store()).getContent()
        send(res, 200, { ok: true, content })
      } catch (err) {
        console.error(err)
        send(res, 200, { ok: true, content: defaultContent || {} })
      }
      return true
    }

    if (p === '/api/content' && req.method === 'POST') {
      if (!validToken(bearer(req), secret)) {
        send(res, 401, { ok: false, error: 'Session expirée.' })
        return true
      }
      const body = await readBody(req)
      if (!body.content || typeof body.content !== 'object') {
        send(res, 400, { ok: false, error: 'Contenu manquant.' })
        return true
      }
      await (await store()).setContent(body.content)
      send(res, 200, { ok: true })
      return true
    }

    if (p === '/api/credentials' && req.method === 'POST') {
      if (!validToken(bearer(req), secret)) {
        send(res, 401, { ok: false, error: 'Session expirée.' })
        return true
      }
      const body = await readBody(req)
      const username = String(body.username || '').trim()
      const code = String(body.code || '')
      if (username.length < 4 || code.length < 6) {
        send(res, 400, { ok: false, error: 'Identifiant trop court.' })
        return true
      }
      await (await store()).setCreds({ username, code })
      send(res, 200, { ok: true })
      return true
    }

    if (p === '/api/leads' && req.method === 'GET') {
      if (!validToken(bearer(req), secret)) {
        send(res, 401, { ok: false, error: 'Session expirée.' })
        return true
      }
      send(res, 200, { ok: true, leads: await (await store()).getLeads() })
      return true
    }

    if (p === '/api/leads' && req.method === 'POST') {
      const body = await readBody(req)
      const lead = {
        id: crypto.randomBytes(8).toString('hex'),
        createdAt: new Date().toISOString(),
        name: String(body.name || '').slice(0, 80),
        phone: String(body.phone || '').slice(0, 30),
        direction: String(body.direction || '').slice(0, 40),
        weight: String(body.weight || '').slice(0, 12),
        cityFrom: String(body.cityFrom || '').slice(0, 60),
        cityTo: String(body.cityTo || '').slice(0, 60),
        message: String(body.message || '').slice(0, 800),
        prefer: String(body.prefer || 'whatsapp').slice(0, 20),
      }
      if (!lead.name || !lead.phone) {
        send(res, 400, { ok: false, error: 'Nom et téléphone requis.' })
        return true
      }
      const db = await store()
      const leads = await db.getLeads()
      leads.unshift(lead)
      await db.setLeads(leads.slice(0, 200))
      send(res, 200, { ok: true, id: lead.id })
      return true
    }

    return false
  }

  return { handle }
}
