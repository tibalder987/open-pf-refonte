# OPEN PF – Prototype HTML 9/10 (mockup enrichi)

Ce dossier contient la version refondue en architecture multi-pages statique, complétée avec les écrans back-office manquants.

## Pages publiques
- `index.html` — Accueil
- `reseau.html` — Le réseau / Qui sommes-nous
- `adherents.html` — Annuaire des adhérents
- `fiche-onati.html` — Exemple de fiche détaillée
- `actualites.html` — Liste des actualités
- `offres-emploi.html` — Liste des offres
- `contact.html` — Contact
- `adhesion.html` — Formulaire d'adhésion
- `espace-adherent.html` — Magic link / Édition de fiche

## Pages back-office (administrateur)
- `admin.html` — Vue d'ensemble (tableau de bord)
- `admin-demandes.html` — **Liste des demandes d'adhésion** avec filtres & tri
- `admin-demande-detail.html` — **Détail d'une demande** (consultation + actions de validation)
- `admin-adherents.html` — **Liste des fiches adhérents** (statuts : à valider / actif / inactif / brouillon)
- `admin-fiche-detail.html` — **Validation d'une fiche** (aperçu + actions)
- `admin-relances.html` — **Journal des relances** automatiques + relance manuelle
- `admin-actualites.html` — **Gestion des actualités** (pattern réutilisable pour offres d'emploi & événements)
- `admin-actualite-edit.html` — **Éditeur d'article** (titre, slug, contenu, SEO, statut)
- `admin-parametres.html` — **Paramètres** (chiffres clés, bureau, frise, partenaires, coordonnées, compte)

## Pages publiques additionnelles à créer en phase Claude Code
- Détail d'un article d'actualité (`/actualites/[slug]`)
- Détail d'une offre d'emploi (`/offres-emploi/[slug]`)
- Page « Pourquoi adhérer »
- Page Tremplins du Numérique
- Mentions légales / Politique de confidentialité
- Page 404
- Page de confirmation post-adhésion
- Page « Lien magique expiré »

## Design system
- Tokens CSS dans `assets/css/styles.css` (~226 lignes)
- Couleur principale : `--open-magenta: #e6007e` *(à valider — cf. addendum CDC)*
- Typo : Inter

## Points d'amélioration intégrés
- séparation HTML / CSS / JS
- architecture multi-pages
- sémantique HTML renforcée
- navigation accessible
- SEO de base par page
- Open Graph
- JSON-LD Organization
- formulaires avec labels
- design system CSS centralisé
- responsive mobile
- assets et données séparés
- filtres JS progressifs
- composants réutilisables
- back-office complet (8 écrans)

## Réutilisation des patterns pour Claude Code

Les patterns suivants sont définis par les écrans existants — à dupliquer pour les pages manquantes :
- **Liste + filtres + table + pagination** → modèle `admin-demandes.html` / `admin-actualites.html`
- **Détail + actions latérales** → modèle `admin-demande-detail.html` / `admin-fiche-detail.html`
- **Éditeur 2 colonnes (contenu + sidebar)** → modèle `admin-actualite-edit.html`
- **Paramètres multi-sections avec tabs** → modèle `admin-parametres.html`
