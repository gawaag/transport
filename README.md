# S.A.M TRANSPORT CHARK

Site France–Maroc. Build Vite, hebergement Netlify.

## Local

```bash
npm install
npm run dev
```

Admin : `/console-lx91`

## Netlify

1. Importer le repo `gawaag/transport`.
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Variables d'environnement :

| Variable | Role |
| --- | --- |
| `CMS_USERNAME` | Identifiant admin |
| `CMS_PASSWORD` | Code admin |
| `CMS_SESSION_SECRET` | Secret session (long, aleatoire) |

Sans ces variables, le site public s'affiche quand meme. Seul l'admin `/console-lx91` exige les identifiants.
