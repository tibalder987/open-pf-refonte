# OPEN PF — Refonte

Site vitrine + module d'adhésion pour l'Organisation des Professionnels de l'Économie Numérique de Polynésie française.

## Prérequis

- Node.js 22 (voir `.nvmrc`)
- pnpm 11+

## Installation

```bash
cp .env.example .env.local   # remplir les variables
pnpm install
```

## Commandes

```bash
pnpm dev          # serveur de développement (http://localhost:3000)
pnpm build        # build de production
pnpm start        # démarrer le build de production
pnpm lint         # ESLint
pnpm typecheck    # vérification TypeScript
pnpm test         # tests unitaires (Vitest)
pnpm e2e          # tests end-to-end (Playwright)
```

## Base de données

```bash
pnpm exec drizzle-kit generate   # générer une migration
pnpm exec drizzle-kit migrate    # appliquer les migrations
pnpm exec drizzle-kit studio     # Drizzle Studio (UI)
```

## Spécifications

Voir `architecture.md`, `DECISIONS.md`, `seeds/` et `mockup/` pour le détail du projet.
