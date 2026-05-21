# CLAUDE.md — Règles de code pour Claude Code

> **Lis ce fichier avant chaque action.** Il définit les règles non-négociables du projet.  
> Pour le détail architectural, lis `architecture.md`. Pour le périmètre fonctionnel, `CDC_Refonte_open-pf.pdf`.

---

## Règle d'or

**Tu codes comme un développeur senior, pas comme un junior pressé.**  
Si tu hésites entre "faire vite" et "faire propre" : fais propre. Si tu n'es pas sûr d'un choix, propose 2 options et demande, ne tranche pas seul sur du structurant.

---

## 1. Stack imposée (ne pas dévier)

Voir `architecture.md` §2. **Ne pas introduire de nouvelle dépendance majeure sans m'en parler** (ex : pas de Redux, pas de tRPC, pas de Prisma, pas de Mongoose).

Avant d'ajouter une dépendance mineure : vérifier qu'elle est maintenue (dernier commit < 6 mois), TypeScript natif, < 100 kB, et qu'on n'a pas déjà l'équivalent installé.

---

## 2. TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- **Zéro `any`**. Utiliser `unknown` puis narrow. Si vraiment bloqué : `// eslint-disable-next-line` avec une raison écrite
- Pas de `@ts-ignore` ni `@ts-expect-error` sans commentaire qui justifie
- Types inférés > types explicites quand l'inférence est claire (ne pas typer `const x: number = 1`)
- Interfaces pour les contrats publics, types pour les unions/intersections
- Noms : `PascalCase` pour types/interfaces/composants, `camelCase` pour le reste

## 3. Validation = Zod, partout

- **Toute** donnée externe (form, API, env var, body de webhook) passe par un schéma Zod
- Schémas centralisés dans `src/lib/validations/`
- `z.infer<typeof schema>` pour récupérer le type, jamais redéfini manuellement
- Variables d'env : `src/lib/env.ts` (Zod) qui crash au boot si manquante/invalide

## 4. Next.js App Router

- **Server Components par défaut**. `"use client"` uniquement pour : state, effects, event handlers, browser APIs
- **Server Actions** pour les mutations. Pas d'API routes sauf : webhooks, cron, fichiers volumineux
- Co-locate : la query Drizzle est dans le fichier serveur qui s'en sert (ou dans `lib/db/queries/` si réutilisée)
- `loading.tsx` + `error.tsx` à chaque segment qui en a besoin
- `generateMetadata` sur toutes les pages publiques
- Aucun `<Image>` HTML brut : `next/image` partout, dimensions explicites

## 5. Style / UI

- **Shadcn d'abord** : `npx shadcn add <component>` plutôt que coder un nouveau primitive
- Tailwind only, pas de CSS modules ni de styled-components
- Pas de styles inline sauf cas vraiment exceptionnel
- Variantes via `cva` (class-variance-authority) — déjà installé via Shadcn
- Theme : tokens dans `tailwind.config.ts` mirroitant le design system du mockup HTML existant
- Mobile-first : `className="text-base md:text-lg"` (jamais l'inverse)

## 6. Accessibilité

- **Jamais** de `<div>` cliquable avec `onClick` → utiliser `<button>` ou `<Link>`
- Tout input a un `<label>` associé (Shadcn `<Label>` fait ça)
- Erreurs de form reliées via `aria-describedby`
- Focus trap dans les modales (Shadcn `Dialog` le fait)
- `aria-live` pour les changements dynamiques (filtres annuaire, validations)
- Contraste : tester avant de committer du texte sur fond coloré

## 7. Structure de fichiers

- **Un export par fichier** (composant ou fonction). Exception : les barrel files `index.ts`
- Nommage : `kebab-case.tsx` pour les fichiers, `PascalCase` pour les composants à l'intérieur
- Pas de fichier > 300 lignes. Au-delà : découper
- Imports : ordre = node → externe → `@/lib` → `@/components` → relatif → types. ESLint le force.
- Path aliases : `@/components`, `@/lib`, `@/app` (déjà configuré dans `tsconfig.json`)

## 8. Drizzle / DB

- Schéma dans `src/lib/db/schema.ts`, **un seul fichier** pour la vue d'ensemble
- Migrations générées via `drizzle-kit generate`, **commitées** dans `drizzle/`
- **Jamais `drizzle-kit push` en production.** Seulement `migrate`
- Requêtes : utiliser le query builder, **pas** de `sql\`...\`` brut sauf cas justifié
- Pas de `SELECT *` : sélectionner les colonnes nécessaires
- Toujours transactionner les écritures multi-tables

## 9. Forms

- `react-hook-form` + `zodResolver` partout
- Sauvegarde locale (`localStorage`) pour les forms multi-étapes
- Server Action de submit reçoit du `FormData` ou un objet typé, le valide via Zod, retourne `{ success, errors? }`
- Pas de `e.preventDefault()` manuels dans des form Server Actions

## 10. Erreurs

- Pas de `try/catch` qui swallow. Si on catch : on relog + on remonte ou on transforme en erreur typée
- Erreurs métier : classe `AppError extends Error` avec `code` et `httpStatus`
- Sentry : capturer côté server, exposer un `eventId` à l'utilisateur pour le support

## 11. Tests

- **Unitaires** (Vitest) : tous les schémas Zod, tous les `lib/utils`, toute logique métier non-triviale
- **E2E** (Playwright) : parcours adhésion happy path, magic link, validation admin, relance
- Lancer `pnpm test` + `pnpm e2e` avant de me dire "c'est fini"
- `axe-core/playwright` actif dans les e2e — toute violation a11y bloque

## 12. Performance — non-négociable

- Bundle first-load JS < 80 kB sur la home
- `next/image` partout, `loading="lazy"` sauf above-the-fold
- Pas de `useEffect` pour fetcher de la donnée si on peut faire un Server Component
- `revalidate` adapté par page (voir `architecture.md` §6)
- Pas d'import "barrel" depuis des libs (`import { ... } from 'lodash'` est interdit, utiliser `lodash-es/specific`)

## 13. SEO

- `generateMetadata` partout, OG image dynamique sur articles/fiches
- JSON-LD : `Organization` global + spécifique par page (`Article`, `JobPosting`, `BreadcrumbList`)
- `sitemap.ts` et `robots.ts` à la racine de `app/`
- Redirections 301 depuis les URLs WordPress legacy (à fournir par le bureau) dans `next.config.ts`

## 14. Commits & PRs

- Conventional Commits : `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, `style:`, `perf:`
- Un commit = un changement cohérent. Pas de "wip" mergé sur main
- Toujours faire le diff mental avant de proposer un commit : qu'est-ce qui a changé ?
- Pas de fichier généré commité (sauf migrations Drizzle, qui sont sources)

## 15. Ce qu'il faut me demander avant de faire

- Toute installation de dépendance majeure
- Toute migration DB destructive (drop column, rename, change type)
- Toute modification de l'architecture documentée dans `architecture.md`
- Tout choix d'UX qui dévie du mockup HTML fourni
- Tout endpoint qui sort de la convention Server Actions

## 16. Ce que tu peux faire sans me demander

- Créer des composants en suivant les conventions ci-dessus
- Ajouter des tests
- Refactor local (un fichier, sans changer l'API publique)
- Ajouter du JSDoc / commentaires explicatifs
- Installer un composant Shadcn supplémentaire (`npx shadcn add`)
- Corriger un bug évident
- Améliorer un message d'erreur ou un label utilisateur

---

## Phasing — où on en est

Avant de coder, vérifier la phase active dans `architecture.md` §11 et **ne pas anticiper sur la phase suivante** sauf demande explicite. Travailler par lots commitables.

## Quand quelque chose te paraît bizarre

Tu m'écris : "J'ai remarqué X dans le code / le CDC / l'archi qui me semble incohérent avec Y. Je propose de faire Z. Tu valides ?"

Mieux vaut une question de 30 secondes qu'une heure de refactor.
