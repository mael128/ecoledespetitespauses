# École des Petites Pauses

Site de « L'École des Petites Pauses » : la charte de marque, le cahier de textes (devoirs), et une interface d'administration pour tout modifier sans toucher au code. App Next.js (App Router), pensée pour Vercel.

## Structure

- `app/page.js` — la page charte de marque (couverture, mission, logo, couleurs, typographies, la classe, l'emploi du temps, le règlement, les interdits, la papeterie), tout le texte et les couleurs viennent de `content/guidelines.json`.
- `app/devoirs/page.js` — liste publique des devoirs, depuis `content/devoirs.json`.
- `app/admin/` — interface d'administration protégée par connexion GitHub : édition du texte et des couleurs de la charte, gestion des devoirs, upload des photos.
- `app/api/admin/*` — routes serveur appelées par l'admin ; elles committent directement les changements sur GitHub via l'API Contents, avec un token qui ne quitte jamais le serveur.
- `content/*.json` — le contenu du site, versionné dans le repo. Modifier ces fichiers (à la main ou via l'admin) et pousser sur `main` republie automatiquement le site sur Vercel.
- `design-export/` — le bundle exporté depuis Claude Design (transcript + prototype `.dc.html` d'origine), conservé pour référence.

## Développement local

```
npm install
cp .env.example .env.local   # puis remplir les valeurs, voir ci-dessous
npm run dev
```

## Mise en route (à faire une fois, manuellement)

Trois choses ne peuvent pas être automatisées car elles engagent des identifiants propres au compte GitHub / Vercel :

### 1. Connecter le repo à Vercel

Sur [vercel.com](https://vercel.com), importer `mael128/ecoledespetitespauses`. Chaque push sur `main` (y compris ceux faits par l'admin) redéploie automatiquement.

### 2. Créer une GitHub OAuth App (pour la connexion à `/admin`)

Sur [github.com/settings/developers](https://github.com/settings/developers) → *New OAuth App* :
- **Homepage URL** : `https://<ton-domaine-vercel>`
- **Authorization callback URL** : `https://<ton-domaine-vercel>/api/auth/callback/github`

Récupérer le **Client ID** et générer un **Client Secret**.

Dans les variables d'environnement Vercel du projet, ajouter :
- `GITHUB_ID` = le Client ID
- `GITHUB_SECRET` = le Client Secret
- `ALLOWED_GITHUB_LOGINS` = `mael128,mael12854` (les seuls comptes GitHub autorisés à se connecter à l'admin — modifiable)
- `NEXTAUTH_SECRET` = une valeur aléatoire (générer avec `openssl rand -base64 32`)

### 3. Créer un token GitHub pour que l'admin puisse écrire dans le repo

Sur [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens/new) → créer un **fine-grained token** :
- **Repository access** : uniquement `mael128/ecoledespetitespauses`
- **Permissions** : `Contents` → **Read and write**

⚠️ Ce token ne doit **jamais** être commité ni collé dans le code — seulement ajouté comme variable d'environnement Vercel :
- `GH_COMMIT_TOKEN` = le token
- `GH_REPO_OWNER` = `mael128`
- `GH_REPO_NAME` = `ecoledespetitespauses`
- `GH_BRANCH` = `main`

Il reste stocké côté serveur (Vercel) et n'est utilisé que dans `app/api/admin/*` — il n'est jamais envoyé au navigateur.

### Après ça

Redéployer une fois les variables ajoutées (Vercel → Deployments → Redeploy). `/admin` devient utilisable : connexion avec le compte GitHub `mael128` ou `mael12854`, édition du contenu, et chaque « Enregistrer » fait un vrai commit sur `main` qui republie le site en une à deux minutes.

## À faire avant mise en ligne

Les photos (Marin, Maël, Maman & Papa, Jojo, le cahier, le tampon, l'affiche) sont des placeholders — à uploader depuis l'onglet **Photos** de l'admin, ou en déposant les fichiers dans `public/photos/` et en éditant `content/guidelines.json`.
