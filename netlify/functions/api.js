import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createCms } from '../../cms/handlers.js'

function loadDefault() {
  const files = [
    path.join(process.cwd(), 'src/data/site.json'),
    path.join(process.cwd(), 'public/content.json'),
    path.join(process.cwd(), 'dist/content.json'),
  ]
  for (const file of files) {
    try {
      return JSON.parse(readFileSync(file, 'utf8'))
    } catch {
      /* try next */
    }
  }
  return {}
}

const cms = createCms({ defaultContent: loadDefault() })

function headersFrom(event) {
  const raw = event.headers || {}
  const out = {}
  for (const [k, v] of Object.entries(raw)) out[k.toLowerCase()] = v
  return out
}

function apiPath(event) {
  const p = event.path || '/api'
  if (p.startsWith('/api/')) return p
  const m = p.match(/\/\.netlify\/functions\/api\/?(.*)$/)
  if (m) return `/api/${m[1] || ''}`.replace(/\/$/, '') || '/api'
  return p
}

export async function handler(event) {
  try {
    const requestPath = apiPath(event)
    const qs = event.rawQuery ? `?${event.rawQuery}` : ''
    let body = event.body
    if (event.isBase64Encoded && body) {
      body = Buffer.from(body, 'base64').toString('utf8')
    }
    if (typeof body === 'string' && body) {
      try {
        body = JSON.parse(body)
      } catch {
        body = {}
      }
    }

    const req = {
      method: event.httpMethod || 'GET',
      url: `${requestPath}${qs}`,
      headers: headersFrom(event),
      body: body && typeof body === 'object' ? body : {},
    }

    let payload = ''
    const resHeaders = {}
    const res = {
      headersSent: false,
      statusCode: 200,
      setHeader(k, v) {
        resHeaders[k] = v
      },
      end(data) {
        payload = data ?? ''
        this.headersSent = true
      },
    }

    const handled = await cms.handle(req, res)
    if (!handled) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ ok: false, error: 'Not found' }),
      }
    }
    return {
      statusCode: res.statusCode || 200,
      headers: resHeaders,
      body: payload,
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: false, error: 'API indisponible.' }),
    }
  }
}
