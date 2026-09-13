# École des Petites Pauses — Charte de marque

Page web statique présentant la charte de marque officielle de « L'École des Petites Pauses ». Page unique, déroulante, sans build : `index.html` + `css/style.css`.

## Structure

- `index.html` — la page (couverture, mission, logo, couleurs, typographies, la classe, l'emploi du temps, le règlement, les interdits, la papeterie).
- `css/style.css` — les styles (variables de couleurs/typo, cartes, grilles).
- `design-export/` — le bundle exporté depuis Claude Design (transcript de conversation + prototype `.dc.html` d'origine), conservé pour référence.

## Développement local

Aucune dépendance : ouvrir `index.html` dans un navigateur, ou servir le dossier avec un serveur statique, par ex. :

```
python3 -m http.server
```

## À faire avant mise en ligne

Les visuels (photo de Marin, de Maël, de Maman & Papa, de Jojo, le cahier, le tampon, l'affiche) sont des placeholders (motif hachuré) — à remplacer par les vraies photos dans `.student__photo` / `.good__photo` quand elles seront disponibles.
