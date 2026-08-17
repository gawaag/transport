import { createCms } from './handlers.js'

export function cmsPlugin(root) {
  const cms = createCms({ root })

  function attach(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next()
      try {
        const handled = await cms.handle(req, res)
        if (!handled) next()
      } catch (err) {
        console.error(err)
        if (!res.headersSent) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Erreur serveur.' }))
        }
      }
    })
  }

  return {
    name: 'livraison-cms',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}
