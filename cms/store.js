import fs from 'node:fs'
import path from 'node:path'

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
}

export function createFsStore(root, defaultContent) {
  const contentFile = path.join(root, 'public', 'content.json')
  const leadsFile = path.join(root, 'public', 'leads.json')
  const credFile = path.join(root, 'cms', 'credentials.json')
  const distFile = path.join(root, 'dist', 'content.json')

  return {
    async getContent() {
      return readJson(contentFile, defaultContent || {})
    },
    async setContent(data) {
      writeJson(contentFile, data)
      if (fs.existsSync(path.join(root, 'dist'))) {
        try {
          writeJson(distFile, data)
        } catch {
          /* dist may be missing */
        }
      }
    },
    async getLeads() {
      return readJson(leadsFile, [])
    },
    async setLeads(data) {
      writeJson(leadsFile, data)
    },
    async getCreds() {
      return readJson(credFile, null)
    },
    async setCreds(data) {
      writeJson(credFile, data)
    },
  }
}

export async function createBlobStore(defaultContent) {
  const { getStore } = await import('@netlify/blobs')
  const blobs = getStore({ name: 'sam-cms', consistency: 'strong' })

  return {
    async getContent() {
      const data = await blobs.get('content', { type: 'json' })
      return data || defaultContent || {}
    },
    async setContent(data) {
      await blobs.setJSON('content', data)
    },
    async getLeads() {
      const data = await blobs.get('leads', { type: 'json' })
      return Array.isArray(data) ? data : []
    },
    async setLeads(data) {
      await blobs.setJSON('leads', data)
    },
    async getCreds() {
      const data = await blobs.get('credentials', { type: 'json' })
      return data || null
    },
    async setCreds(data) {
      await blobs.setJSON('credentials', data)
    },
  }
}

export async function createStore({ root, defaultContent }) {
  if (process.env.NETLIFY) {
    try {
      return await createBlobStore(defaultContent)
    } catch (err) {
      console.error('Netlify Blobs unavailable, using memory fallback', err)
      let content = defaultContent || {}
      let leads = []
      let creds = null
      return {
        async getContent() {
          return content
        },
        async setContent(data) {
          content = data
        },
        async getLeads() {
          return leads
        },
        async setLeads(data) {
          leads = data
        },
        async getCreds() {
          return creds
        },
        async setCreds(data) {
          creds = data
        },
      }
    }
  }
  return createFsStore(root, defaultContent)
}
