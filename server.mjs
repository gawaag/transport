import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCms } from './cms/handlers.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')
const cms = createCms({ root })
const app = express()
const port = Number(process.env.PORT || 4173)

app.use(express.json({ limit: '2mb' }))

app.get('/content.json', (_req, res) => {
  res.sendFile(path.join(root, 'public', 'content.json'))
})

app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api/')) return next()
  req.url = req.originalUrl
  const handled = await cms.handle(req, res)
  if (!handled) next()
})

app.use(express.static(path.join(root, 'public'), { index: false }))

if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`S.A.M TRANSPORT CHARK → http://localhost:${port}`)
})
