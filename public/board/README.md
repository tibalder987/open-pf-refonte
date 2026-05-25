# Photos du bureau OPEN (mandat 2025-2027)

Déposer ici **uniquement les portraits validés** par les personnes concernées.

## Convention de nommage
`prenom-nom.jpg` (minuscules, sans accents, tirets). Exemples :
- `olivier-kressmann.jpg`
- `jean-pierre-claude.jpg`

## Recommandations
- Format carré (ratio 1:1), idéalement ≥ 400×400 px.
- `.jpg` ou `.webp`, optimisé (< 200 Ko).
- Visage centré (la card recadre en cercle via `object-fit: cover`).

## Activer une photo
Une fois le fichier déposé, renseigner `photoUrl` dans
`src/lib/data/board-members.ts`, ex :
```ts
photoUrl: '/board/olivier-kressmann.jpg'
```

⚠️ Ne jamais utiliser d'URL LinkedIn ou externe comme source : ces URLs ne sont
pas stables. Sans photo validée, un placeholder premium aux initiales s'affiche.
