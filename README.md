# Refonte du site OPEN PF

Package complet de spécifications et ressources pour la refonte du site internet de l'**Organisation des Professionnels de l'Économie Numérique de Polynésie française** ([open.pf](https://open.pf)).

Tout est prêt pour lancer le développement avec **Claude Code**.

---

## 🚀 Quickstart

```bash
# 1. Place ce dossier où tu veux travailler
cd ~/Desktop/open-pf-refonte

# 2. Init git
git init && git add . && git commit -m "chore: initial setup"

# 3. Si pas installé, installe Claude Code
npm install -g @anthropic-ai/claude-code

# 4. Lance
claude

# 5. Dans Claude Code :
/model sonnet           # voir section "Modèle" plus bas

# 6. Colle le prompt depuis PROMPT_INITIAL.md
```

---

## 📁 Structure du package

```
open-pf-refonte/
├── README.md                       ← ce fichier
├── PROMPT_INITIAL.md                ← le prompt à coller dans Claude Code
├── CLAUDE.md                        ← règles de code (lu auto par Claude Code)
├── architecture.md                  ← stack, structure, phasing (P0 à P9)
├── architecture-addendum.md         ← ajustements suite aux arbitrages
├── DECISIONS.md                     ← source de vérité unique des 11 décisions
├── questionnaire.md                 ← questions résiduelles pour le bureau OPEN PF
│
├── CDC_Refonte_open-pf.pdf          ← cahier des charges fonctionnel
│
├── mockup/                          ← maquette HTML COMPLÈTE (18 pages)
│   └── open_pf_site_8_5/
│       ├── index.html               page d'accueil
│       ├── reseau.html              "Qui sommes-nous / Le réseau"
│       ├── adherents.html           annuaire
│       ├── fiche-onati.html         exemple fiche détaillée
│       ├── actualites.html          
│       ├── offres-emploi.html
│       ├── contact.html
│       ├── adhesion.html            formulaire d'adhésion
│       ├── espace-adherent.html     magic link / édition fiche
│       ├── admin.html               BO — vue d'ensemble
│       ├── admin-demandes.html      BO — liste demandes adhésion
│       ├── admin-demande-detail.html BO — détail demande
│       ├── admin-adherents.html     BO — liste fiches
│       ├── admin-fiche-detail.html  BO — validation fiche
│       ├── admin-relances.html      BO — journal relances
│       ├── admin-actualites.html    BO — CRUD actus
│       ├── admin-actualite-edit.html BO — éditeur d'article
│       ├── admin-parametres.html    BO — settings + chiffres auto
│       └── assets/
│           ├── css/styles.css       design system complet
│           ├── js/app.js
│           └── data/members.json
│
└── seeds/                           ← contenus réels scrapés depuis open.pf
    ├── referentiels.md              statuts juridiques, 19 domaines, 22 certifications
    ├── adherents.csv                54 adhérents avec URLs et logos
    ├── institutionnel.md            manifeste, 8 membres du bureau, 7 dates de la frise, contact, partenaires
    ├── emails-templates.md          8 templates transactionnels FR pro
    └── manques-restants.md          ce qu'il manque encore (4 items + workarounds)
```

---

## 🤖 Modèle Claude à utiliser : **Sonnet**

Avec ton forfait **Max 20x à $200/mois**, tu as ~240 à 480 heures de Sonnet et 24 à 40 heures d'Opus par semaine.

### Pour ce projet, Sonnet 4.6 est largement suffisant. Voici pourquoi :

| Critère | État du projet |
|---|---|
| Architecture définie ? | ✅ Complète (`architecture.md` + `addendum`) |
| Stack imposée ? | ✅ Next.js 15 + Drizzle + Shadcn, sans ambiguïté |
| Patterns conventionnels ? | ✅ App Router, Server Components, Server Actions — Sonnet connaît par cœur |
| Mockup visuel complet ? | ✅ 18 pages HTML à reproduire 1:1 |
| Référentiels métier ? | ✅ Listes fermées dans `seeds/` |
| Décisions à prendre par l'IA ? | Minimes — toutes dans `DECISIONS.md` |

C'est exactement la situation où **Sonnet excelle** : implémentation propre de specs claires, génération de boilerplate, refactor local, tests.

### Quand basculer sur Opus (`/model opus`)

Réserve Opus pour ces cas précis :
- **Debugging long** où Sonnet tourne en rond depuis 3-4 essais
- **Refactor cross-fichiers** complexe (rare ici)
- **Conception d'algorithmes** non triviaux (par exemple si la logique de relances devient compliquée)
- **Migration de données** WordPress → DB si on veut vraiment scraper les ~30 articles

**Conseil pratique** : reste sur Sonnet par défaut, bascule sur Opus uniquement quand tu sens que Sonnet bloque. Sur ton forfait, tu ne risques rien à essayer.

### Commandes Claude Code utiles

```
/model sonnet          basculer sur Sonnet
/model opus            basculer sur Opus
/help                  aide complète
/clear                 vider le contexte (utile entre phases)
/init                  laisser Claude Code générer son CLAUDE.md (déjà fait ici)
/cost                  voir ta consommation
shift+tab              activer/désactiver auto-accept des edits
```

---

## 🔄 Workflow recommandé phase par phase

À la fin de chaque phase, **commit propre + push + validation par toi avant la suivante**.

| Phase | Durée estimée | Modèle | Sortie attendue |
|---|---|---|---|
| **P0** Setup | 30-60 min | Sonnet | Repo qui build/lint/test à vide |
| **P1** Design system | 1-2 h | Sonnet | Header/footer + composants Shadcn |
| **P2** Schéma DB + seeds | 2-3 h | Sonnet | Tables + référentiels + 54 adhérents en DB |
| **P3** Site public statique | 3-5 h | Sonnet | Toutes les pages publiques navigables |
| **P4** Adhésion modale | 3-4 h | Sonnet | Parcours 3 étapes + e-mails |
| **P5** Fiche adhérent | 2-3 h | Sonnet | Magic link + upload logo |
| **P6** Back-office | 5-7 h | Sonnet | 8 écrans admin fonctionnels |
| **P7** Cron relances | 1-2 h | Sonnet | Endpoint + tests |
| **P8** SEO/perf/a11y | 2-3 h | Sonnet | Audit propre |
| **P9** Recette + doc | 2 h | Sonnet | E2E tests + manuel d'admin |

**Total estimé** : 22-32 heures de travail Claude Code. Sur Max 20x, sans souci.

---

## 📋 Avant de lancer Claude Code, derniers vérifs

- [ ] Node.js LTS installé (`node -v` doit afficher v20.x ou v22.x)
- [ ] pnpm installé (`pnpm -v`)
- [ ] Git configuré (`git config --global user.name` et `user.email` renseignés)
- [ ] Claude Code installé (`claude --version`)
- [ ] Connecté avec ton compte Max (`claude login` ou via l'onboarding)
- [ ] Ce dossier git-initialisé avec un commit initial

---

## 🆘 Si quelque chose foire

1. **Claude part dans tous les sens** : utilise les phrases défensives à la fin de `PROMPT_INITIAL.md`
2. **Erreur de build / lint** : copie l'erreur dans Claude Code, il debug
3. **Décision ambiguë** : renvoie-le vers `DECISIONS.md`
4. **Sonnet semble bloqué** : `/model opus`, retente, puis reviens à `/model sonnet`
5. **Contexte saturé** (>150k tokens) : `/clear` puis recolle le prompt initial en demandant la phase en cours
6. **Doute fonctionnel** : relis le `CDC_Refonte_open-pf.pdf`

---

## 📞 Ressources externes

- Documentation Claude Code : https://docs.claude.com/en/docs/claude-code/overview
- Documentation Next.js 15 : https://nextjs.org/docs
- Documentation Drizzle : https://orm.drizzle.team/
- Documentation Shadcn : https://ui.shadcn.com/
- Brevo (e-mails) : https://www.brevo.com/
- Neon (Postgres) : https://neon.tech/

---

**Bonne refonte. 🌺**
