# École des Petites Pauses

Site de « L'École des Petites Pauses » : la charte de marque, le cahier de textes (devoirs), les fiches prof, un panneau de messages, l'emploi du temps, les récompenses, le carnet de notes, une galerie photos, et une interface d'administration pour tout modifier sans toucher au code. App Next.js (App Router), pensée pour Vercel.

## Structure

- `app/page.js` — la charte de marque (couverture, mission, logo, couleurs, typographies, la classe, l'emploi du temps, le règlement, les interdits, la papeterie), tout le texte et les couleurs viennent de `content/guidelines.json`.
- `app/devoirs/page.js` — liste publique des devoirs, depuis `content/devoirs.json`.
- `app/fiches/page.js` — liste publique des fiches prof (le classeur), depuis `content/fiches.json`.
- `app/messages/page.js` — panneau d'annonces (changements d'horaire, etc.), depuis `content/messages.json`.
- `app/planning/page.js` — emploi du temps interactif, groupé par jour, depuis `content/planning.json`.
- `app/recompenses/page.js` — tableau des tampons/récompenses par élève, depuis `content/recompenses.json`.
- `app/carnet/page.js` — carnet de notes et évaluations par élève, depuis `content/notes.json`.
- `app/galerie/page.js` — galerie photos de la vie de l'école, depuis `content/galerie.json`.
- `app/admin/` — interface d'administration : édition du texte/couleurs de la charte, gestion des devoirs, des fiches, des messages, de l'emploi du temps, des récompenses, du carnet de notes, de la galerie, et upload des photos.
- `app/api/admin/*` — routes serveur appelées par l'admin ; elles committent directement les changements sur GitHub via l'API Contents.
- `content/*.json` — le contenu du site, versionné dans le repo. Modifier ces fichiers (à la main ou via l'admin) et pousser sur `main` republie automatiquement le site sur Vercel.
- `design-export/` — le bundle exporté depuis Claude Design (transcript + prototype `.dc.html` d'origine), conservé pour référence.

## Développement local

```
npm install
npm run dev
```

## Mise en route

### 1. Connecter le repo à Vercel

Sur [vercel.com](https://vercel.com), importer `mael128/ecoledespetitespauses`. Chaque push sur `main` (y compris ceux faits par l'admin) redéploie automatiquement. **Aucune variable d'environnement n'est nécessaire** pour que ça fonctionne.

### 2. Utiliser l'admin (`/admin`)

Pas de compte à créer, pas d'app OAuth à configurer : l'admin demande juste un **token GitHub**, collé une fois dans le navigateur (stocké en local, jamais envoyé ailleurs qu'à GitHub via ce site).

Pour créer ce token : [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) → **fine-grained token** :
- **Repository access** : uniquement `mael128/ecoledespetitespauses` (surtout pas « tous les repos »)
- **Permissions** : `Contents` → **Read and write**

Donne ce token à qui doit pouvoir modifier le site (toute la famille peut avoir le même, ou un chacun). Comme il n'a accès qu'à ce seul repo, un token qui fuite ne met en danger que ce site — pas le reste du compte GitHub.

Une fois collé dans `/admin`, chaque « Enregistrer » fait un vrai commit sur `main` qui republie le site en une à deux minutes.

## À faire avant mise en ligne

Les photos (Marin, Maël, Maman & Papa, Jojo, le cahier, le tampon, l'affiche) sont des placeholders — à uploader depuis l'onglet **Photos** de l'admin, ou en déposant les fichiers dans `public/photos/` et en éditant `content/guidelines.json`.
