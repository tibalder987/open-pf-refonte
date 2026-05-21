# Prompt initial pour Claude Code

> Copie-colle **le bloc ci-dessous** dans Claude Code après avoir lancé `claude` depuis le dossier du projet.  
> Ce prompt est volontairement défensif : il force Claude à confirmer sa compréhension avant de coder, et à s'arrêter à la fin de P0.

---

## ⚙️ Recommandations préalables

1. **Modèle** : Sonnet 4.6 (`/model sonnet`) — voir `README.md` pour le pourquoi
2. **Mode plan** : actif au départ (`shift+tab` pour activer)
3. **Auto-validation** : désactivée — tu valides chaque modification d'arbo majeure

---

## 📋 Prompt à copier intégralement

```
Tu vas travailler sur la refonte du site OPEN PF — Organisation des Professionnels de l'Économie Numérique de Polynésie française (cluster d'environ 54 entreprises, association loi 1901 affiliée au MEDEF PF).

═══════════════════════════════════════════════════════════════════
ÉTAPE 1 — LECTURE OBLIGATOIRE AVANT TOUTE ACTION
═══════════════════════════════════════════════════════════════════

Lis dans cet ordre, sans rien faire d'autre :

1. CLAUDE.md ............................ règles de code non-négociables
2. architecture.md ...................... stack et structure des dossiers
3. architecture-addendum.md ............. ajustements suite aux arbitrages
4. DECISIONS.md ......................... source de vérité unique des 11 décisions du projet
5. CDC_Refonte_open-pf.pdf .............. périmètre fonctionnel exhaustif
6. seeds/referentiels.md ................ statuts juridiques, domaines, certifications
7. seeds/institutionnel.md .............. manifeste, bureau, frise, partenaires, contact
8. seeds/adherents.csv .................. 54 adhérents avec URLs et logos
9. seeds/emails-templates.md ............ 8 templates transactionnels
10. seeds/manques-restants.md ........... ce qui reste à clarifier
11. mockup/open_pf_site_8_5/ ............ maquette HTML COMPLÈTE (18 pages, dont 9 admin) à reproduire 1:1 visuellement

═══════════════════════════════════════════════════════════════════
ÉTAPE 2 — CONFIRMATION DE COMPRÉHENSION
═══════════════════════════════════════════════════════════════════

Après lecture, AVANT toute action de code, résume-moi en français :

a) La stack technique retenue (5 lignes max)
b) Les 5 décisions clés du projet (palette, étapes adhésion, modal, chiffres auto, modération)
c) La phase actuelle (P0) et ce qu'elle inclut/exclut
d) Tes 3 questions principales si quelque chose te paraît ambigu
e) Le plan d'exécution de P0 que tu vas suivre

Je valide ton résumé avant que tu lances la moindre commande.

═══════════════════════════════════════════════════════════════════
ÉTAPE 3 — EXÉCUTION DE LA PHASE P0 UNIQUEMENT
═══════════════════════════════════════════════════════════════════

Quand je dis "OK exécute", lance la phase P0 décrite dans architecture.md §11 :

OBJECTIF P0 : un repo Next.js 15 vide qui build, lint, et passe les tests vides.

À installer / configurer :
- Next.js 15 (App Router) + TypeScript strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- Tailwind CSS v4 avec les tokens du mockup (couleurs, radius, fonts) repris dans tailwind.config.ts
- Shadcn/ui initialisé (sans installer les composants — juste init)
- Drizzle ORM + drizzle-kit (config seulement, schema vide)
- Auth.js v5 (install seulement)
- react-hook-form + zod + @hookform/resolvers
- ESLint (next/core-web-vitals + typescript-eslint strict)
- Prettier (tabWidth 2, singleQuote, trailingComma all, printWidth 100)
- Husky + lint-staged (pre-commit : prettier + eslint --fix + tsc --noEmit)
- Vitest + @testing-library/react
- Playwright + @axe-core/playwright
- pnpm comme gestionnaire de paquets (PAS npm, PAS yarn)

À mettre en place :
- Structure de dossiers selon architecture.md §3 (créer les dossiers vides nécessaires, ne pas générer les pages)
- .nvmrc avec la version Node LTS active
- .env.example (variables d'env à lister, voir architecture.md §10)
- src/lib/env.ts avec validation Zod (peut crash si .env manquant)
- Path aliases dans tsconfig.json (@/components, @/lib, @/app)
- README.md du repo (court, juste les commandes)
- .gitignore propre
- LICENSE optionnel (à demander)

Commits attendus (Conventional Commits) :
- chore: init Next.js 15 with TypeScript strict
- chore: tooling (eslint, prettier, husky, lint-staged)
- chore: testing (vitest, playwright, axe-core)
- chore: setup tailwind v4 with design tokens
- chore: setup drizzle, auth.js, forms libs
- chore: project structure and env validation

Vérification finale obligatoire :
- pnpm install      → succès
- pnpm build        → succès (page d'accueil par défaut Next.js)
- pnpm lint         → 0 erreur
- pnpm typecheck    → 0 erreur (ajoute le script si absent)
- pnpm test         → succès (tests vides ou un test trivial)

═══════════════════════════════════════════════════════════════════
RÈGLES STRICTES P0
═══════════════════════════════════════════════════════════════════

❌ NE PAS faire P1 (design system), P2 (DB), ni aucune autre phase.
❌ NE PAS générer de pages (à part le page.tsx par défaut de Next.js).
❌ NE PAS écrire de composants UI.
❌ NE PAS toucher au mockup/ — c'est une RÉFÉRENCE, pas une source de fichiers à modifier.
❌ NE PAS installer de bibliothèque non listée ci-dessus sans me demander.

✅ POSER UNE QUESTION si quelque chose est ambigu plutôt qu'inventer.

═══════════════════════════════════════════════════════════════════
FIN DE P0
═══════════════════════════════════════════════════════════════════

À la fin de P0, fais-moi un résumé :
- Liste des commits créés
- Sortie des 4 commandes de vérification
- Choix qui ont demandé un arbitrage (et lequel tu as fait)
- Proposition de prompt pour P1

ATTENDS MA VALIDATION avant de passer à P1.

═══════════════════════════════════════════════════════════════════

Commence par l'étape 1 — la lecture. Indique quand tu es prêt à me résumer.
```

---

## 🚀 Lancement étape par étape

```bash
# 1. Ouvre un terminal dans le dossier du projet
cd ~/Desktop/open-pf-refonte

# 2. (Si pas déjà fait) installe Claude Code globalement
npm install -g @anthropic-ai/claude-code

# 3. Initialise git pour que Claude Code puisse committer
git init
git add .
git commit -m "chore: initial setup with architecture, mockup, and seeds"

# 4. Lance Claude Code
claude

# 5. (Une fois dans Claude Code)
# Vérifie le modèle :
/model
# Si pas Sonnet, switch :
/model sonnet

# 6. Active le mode plan (recommandé au début) :
# Tape shift+tab → "auto-accept edits" doit s'afficher en jaune ou être désactivé

# 7. Colle le prompt ci-dessus
```

---

## ⏭️ Après P0

Quand P0 est validée et committée, demande à Claude :

```
OK validé. Passe à P1 (design system Tailwind + Shadcn + layout header/footer)
en suivant architecture.md §11 et le mockup/. Mêmes règles : ne pas anticiper sur P2.
```

Et ainsi de suite pour P2, P3, etc.

---

## 🔁 Si Claude s'égare

Phrases utiles à avoir sous la main :

- **"Tu sors du périmètre de Pn. Reviens à la phase actuelle."**
- **"Tu as enfreint une règle de CLAUDE.md (paragraphe X). Corrige et explique."**
- **"Avant de continuer, montre-moi le diff de ce que tu vas faire."**
- **"Trop de fichiers à la fois. Découpe en lots commitables."**
- **"Cette décision n'est pas dans DECISIONS.md. Demande-moi avant."**
