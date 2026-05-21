# Questions à trancher avec le bureau OPEN PF

> Document de cadrage pour la réunion de validation du CDC.  
> Objectif : avoir des réponses fermes sur ces points **avant** de lancer Claude Code, pour éviter de devoir refaire 30 % du travail ensuite.

Chaque question est notée :
- 🔴 **Bloquant** — sans cette réponse, on ne peut pas commencer
- 🟠 **Important** — Claude Code peut commencer mais devra revenir dessus
- 🟢 **Confort** — peut être tranché en cours de projet

---

## 1. Arbitrages prioritaires (incohérences front ↔ CDC)

### 1.1 🔴 Étapes du formulaire d'adhésion
Le CDC §5.2 décrit **5 étapes** (Identité / Contacts / Activité / Compétences & certifs / Récap & consentement). Le mockup HTML montre **3 étapes** (Infos / Domaines / Coordonnées).

**Question :** quel découpage retient-on ?
- [ ] 5 étapes du CDC (recommandé — plus progressif, meilleur taux de complétion)
- [ ] 3 étapes du mockup
- [ ] Autre : _______

### 1.2 🔴 Palette de couleurs
Le CDC §9 demande de *« conserver et faire évoluer la palette identitaire (vert / orange / blanc) »*. Le mockup propose **magenta / navy / cyan**.

**Question :** quelle palette finale ?
- [ ] Magenta / navy / cyan (palette du mockup — rupture assumée)
- [ ] Vert / orange / blanc modernisée (fidèle au CDC, historique)
- [ ] Hybride : _______
- [ ] À refaire par le designer avant lancement

**Note :** la palette est utilisée partout dans le code. Si on change après coup, comptez ~2-3 h de re-tokenisation.

### 1.3 🔴 Adhésion en modale ou page dédiée ?
Le CDC §5.1 dit « overlay / modale ». Le mockup est une page dédiée (`adhesion.html`). Argument pour la page dédiée : meilleure UX mobile, accessibilité plus simple, partageable par URL. Argument pour la modale : ne quitte pas la page d'accueil.

**Question :**
- [ ] Modale en surcouche depuis n'importe quelle page
- [ ] Page dédiée `/adhesion` (recommandé)
- [ ] Les deux : modale rapide + lien « voir en grand » qui ouvre la page

### 1.4 🔴 Chiffres clés réels au lancement
Le CDC mentionne l'incohérence du site actuel (51 / 65 adhérents). Le mockup admin affiche 2 642 (clairement fictif). Il faut **les vrais chiffres** au lancement.

**À fournir :**
- [ ] Nombre exact d'adhérents au 1er juin 2026 : _______
- [ ] Nombre estimé de salariés représentés : _______
- [ ] Nombre de domaines de compétences couverts : _______
- [ ] Légende / contexte à afficher : _______

### 1.5 🟠 Libellé du menu : « Le réseau » ou « Qui sommes-nous » ?
Le CDC §4 dit « Qui sommes-nous » avec sous-menus (Nos actions / Gouvernance / Nos origines). Le mockup dit « Le réseau ».

**Question :**
- [ ] « Qui sommes-nous » + sous-menu déroulant
- [ ] « Le réseau » (plus court, sans sous-menu)
- [ ] Autre : _______

---

## 2. Données référentielles à collecter

Sans ces listes, Claude Code va inventer des contenus à remplacer manuellement.

### 2.1 🔴 Liste fermée des domaines d'activité
Le CDC §5.2 cite à titre d'exemple : développement, communication digitale, hébergement/cloud, télécom/VoIP, cybersécurité, conseil. **Liste exhaustive attendue.**

À fournir sous forme de liste (un domaine par ligne, organisé en familles éventuellement) :
```
Famille : Développement
- Développement web
- Applications mobiles
- E-commerce
- …

Famille : Infrastructure
- Cloud / Hébergement
- Télécom / VoIP
- Cybersécurité
- …
```

### 2.2 🔴 Liste fermée des compétences cochables
Idem — les compétences que l'adhérent peut sélectionner pour apparaître dans les filtres de l'annuaire.

Exemple à compléter :
```
- React / Vue / Angular
- Node.js / Python / Java / PHP
- AWS / Azure / GCP
- Figma / Adobe XD
- Cybersécurité ISO 27001
- …
```

### 2.3 🔴 Liste fermée des certifications/agréments
Avec familles si possible :
```
Agréments :
- Qualiopi
- DataDocké
- …

Certifications éditeurs :
- AWS Certified
- Microsoft Partner
- Google Partner
- Salesforce Partner
- …
```

### 2.4 🟠 Statuts juridiques retenus
Le CDC en cite 6 (personne physique, EURL, SARL, SNC, SA, autre). À confirmer ou compléter :
- [ ] EI / Entreprise individuelle
- [ ] EURL
- [ ] SARL
- [ ] SNC
- [ ] SA
- [ ] SAS / SASU
- [ ] Association loi 1901
- [ ] Coopérative (SCOP)
- [ ] Autre (champ libre)

### 2.5 🔴 Membres du bureau
À fournir : pour chaque membre, **photo (300×300 px min, fond neutre), nom complet, fonction** (président, vice-président, trésorier, secrétaire, etc.).

Idéalement 4 à 8 personnes.

### 2.6 🔴 Frise chronologique
Liste des dates marquantes de l'association :
```
2011 : Création d'OPEN
20XX : Affiliation au MEDEF PF
20XX : Lancement des Tremplins du Numérique
20XX : …
```
6 à 10 dates est un bon ordre de grandeur.

### 2.7 🟠 Liste des partenaires institutionnels
Logos haute définition (PNG transparent ou SVG de préférence) + nom complet + URL site web :
- [ ] MEDEF Polynésie française
- [ ] CCISM
- [ ] Pays / Gouvernement
- [ ] _______

---

## 3. Règles métier à confirmer

### 3.1 🟠 Durée de vie du magic link
**Question :** combien de temps un lien magique reste valide ?
- [ ] 7 jours
- [ ] 30 jours (proposé dans `architecture.md`)
- [ ] 90 jours
- [ ] Sans expiration tant que la fiche n'est pas soumise
- [ ] Autre : _______

### 3.2 🟠 Renouvellement du magic link
**Question :** que se passe-t-il à expiration ?
- [ ] L'adhérent demande lui-même un nouveau lien depuis une page dédiée
- [ ] L'admin renvoie manuellement depuis le back-office (le mockup le permet)
- [ ] Renouvellement automatique avec la relance hebdomadaire

### 3.3 🟠 Limite aux relances automatiques
Le CDC dit « tous les 7 jours tant que la fiche n'est pas complétée ». Sans garde-fou, ça peut tourner 6 mois.

**Question :** stop automatique après…
- [ ] Aucun stop, ad vitam
- [ ] 6 relances (≈ 6 semaines)
- [ ] 10 relances (≈ 2,5 mois)
- [ ] Stop quand l'admin désactive manuellement (recommandé en complément)

### 3.4 🟠 Que devient une fiche désactivée ?
**Question :**
- [ ] Retirée de l'annuaire public, historique conservé en DB pour réactivation
- [ ] Suppression complète après 12 mois
- [ ] Suppression immédiate

Recommandation : option 1 (RGPD-compatible, réactivation simple, audit trail).

### 3.5 🟠 Email de notification au bureau
**Question :** qui reçoit le mail « nouvelle demande d'adhésion à traiter » ?
- [ ] Une adresse fixe (ex. `bureau@open.pf`)
- [ ] Plusieurs adresses en copie
- [ ] L'admin connecté reçoit dans son espace + email

### 3.6 🔴 Validation des fiches : avant ou après publication ?
Le CDC §5.1 dit clairement « validation avant publication ». À confirmer car c'est structurant pour l'UX.

- [ ] Modération a priori (recommandée, conforme CDC)
- [ ] Publication automatique + modération a posteriori

### 3.7 🟢 Refus d'une demande d'adhésion : avec motif ?
- [ ] Refus simple, sans motif communiqué
- [ ] Refus avec motif obligatoire saisi par l'admin, envoyé par e-mail à l'adhérent
- [ ] Refus avec choix de motif dans une liste prédéfinie

---

## 4. Back-office

### 4.1 🔴 Authentification administrateur
Le CDC §6 dit « profil unique d'administrateur ». À préciser :
- [ ] Un seul compte partagé par le bureau (simple mais traçabilité nulle)
- [ ] Un compte par membre du bureau, mêmes droits (recommandé pour l'audit trail)
- [ ] Multi-rôles (admin / éditeur) — hors-périmètre selon CDC §12.2

### 4.2 🟠 Récupération de mot de passe
- [ ] Magic link (e-mail) pour réinitialiser
- [ ] Questions de sécurité
- [ ] Contact technique pour réinitialisation manuelle

### 4.3 🟠 2FA pour l'admin ?
Recommandé même pour 1 admin, vu les données sensibles.
- [ ] Oui — TOTP (Google Authenticator / Authy)
- [ ] Oui — code par e-mail à chaque connexion
- [ ] Non — mot de passe seul

### 4.4 🟢 Durée de session admin avant déconnexion
- [ ] 2 heures
- [ ] 8 heures (journée)
- [ ] 30 jours (« se souvenir de moi »)

---

## 5. Contenu éditorial

### 5.1 🟠 Catégories d'actualités
Liste fermée à valider :
- [ ] Filière
- [ ] Évènement
- [ ] Communiqué
- [ ] Partenariat
- [ ] Autre : _______

### 5.2 🟢 Longueur des articles
- Titre : min/max ?
- Chapô : 280 caractères ?
- Corps : pas de limite ?

### 5.3 🟠 Modalité de candidature aux offres d'emploi
- [ ] E-mail vers l'adhérent (lien `mailto:` simple)
- [ ] Lien externe vers le site de l'adhérent
- [ ] Formulaire intégré au site OPEN (recommandé pour le tracking)
- [ ] Les trois selon le choix de l'éditeur de l'offre

### 5.4 🟢 Événements Tremplins : archive visible ?
- [ ] Les événements passés restent visibles avec mention « passé »
- [ ] Les événements passés sont archivés et masqués
- [ ] L'admin décide au cas par cas

### 5.5 🟠 Newsletter
- [ ] Brevo seul (CDC §7.7)
- [ ] Brevo + double opt-in (recommandé)
- [ ] Autre outil : _______
- Fréquence cible : _______

---

## 6. Communication & emails transactionnels

### 6.1 🔴 Adresse d'expéditeur
- [ ] `contact@open.pf`
- [ ] `noreply@open.pf`
- [ ] `bureau@open.pf`
- [ ] Autre : _______

### 6.2 🔴 Templates d'e-mails à rédiger
À valider auprès du bureau, idéalement avec une charte. Templates nécessaires :

1. **Confirmation de réception de demande** (envoyé à l'adhérent juste après soumission)
2. **Notification au bureau** d'une nouvelle demande
3. **Lien magique de complétion** (envoyé après validation par l'admin)
4. **Relance J+3** (1re relance)
5. **Relances récurrentes +7j**
6. **Confirmation de publication** (fiche validée, visible dans l'annuaire)
7. **Notification de désactivation** (cotisation impayée, désadhésion)
8. **Lien expiré / nouveau lien**

Le bureau a-t-il déjà des textes ou faut-il proposer une trame ?
- [ ] Le bureau fournit les textes finaux
- [ ] Claude génère un canevas, le bureau valide/édite

### 6.3 🟠 Domaine d'envoi / DNS
- Le bureau a-t-il accès à la zone DNS du domaine `open.pf` pour configurer SPF/DKIM/DMARC ?
- [ ] Oui — RGS DSI à contacter
- [ ] Non — il faudra demander
- Hébergeur DNS actuel : _______

---

## 7. SEO & migration

### 7.1 🔴 URLs WordPress existantes
Liste des URLs actuelles du site `open.pf` à rediriger en 301 vers les nouvelles. À extraire :
- [ ] Via Screaming Frog ou audit SEO
- [ ] Manuellement depuis les articles publiés
- [ ] À ignorer (perte SEO acceptée — déconseillé)

### 7.2 🟠 Search Console / Analytics
- Google Search Console déjà configuré sur `open.pf` ? Accès dispo ?
- Outil d'analytics actuel ? (Google Analytics ? Matomo ? rien ?)
- Souhait sur le nouveau site : Plausible (RGPD-friendly, pas de bandeau cookies) ou GA4 ?

### 7.3 🟢 Migration des contenus existants
- Articles d'actualité du site actuel : à reprendre ?
- [ ] Tous (combien environ ?)
- [ ] Seulement les 12 derniers mois
- [ ] On repart de zéro

### 7.4 🟠 Sitemap & robots.txt
- Sitemap auto-généré OK ?
- Pages à exclure de l'indexation ? (`/admin/*` évidemment, autres ?)

---

## 8. Hébergement & opérationnel

### 8.1 🟠 Hébergement final
L'utilisateur a indiqué « pas besoin de RGPD strict ». Donc :
- [ ] Vercel (région `fra1` Frankfurt) — proposé dans architecture.md
- [ ] AWS / OVH / autre

### 8.2 🟢 Domaine
- Domaine principal `open.pf` : transfert DNS prévu quand ?
- Période de cohabitation avec l'ancien site ?

### 8.3 🟠 Sauvegardes
- Fréquence : quotidienne (Neon le fait par défaut)
- Rétention : 7 jours / 30 jours / autre ?
- Cible de récupération en cas de désastre : RTO ? RPO ?

### 8.4 🟢 Monitoring
- Sentry pour les erreurs : OK ?
- Alertes par e-mail vers qui ?
- UptimeRobot ou équivalent pour la surveillance externe ?

---

## 9. Phasing & recette

### 9.1 🟠 Calendrier
Le CDC §11 propose ~17 semaines au total. Confirmer :
- Date cible de mise en ligne : _______
- Échéances intermédiaires (recette, formation, gel des contenus) : _______

### 9.2 🟠 Phase de recette
- [ ] Recette interne (bureau seul)
- [ ] Recette élargie (quelques adhérents pilotes)
- Durée prévue : _______ semaines

### 9.3 🟠 Formation du bureau
- [ ] Sur place
- [ ] Visio
- Combien de personnes ?
- Souhait d'un manuel d'utilisation PDF / vidéo / les deux ?

### 9.4 🟢 Maintenance post-livraison
- Garantie corrective : 3 mois ? 6 mois ?
- Contrat de maintenance optionnel : intéressé ?

---

## 10. Données à fournir en pratique

Le bureau peut me transmettre **un seul dossier ZIP** contenant :

```
ressources-open-pf/
├── chiffres-cles.md           (3 chiffres + légende)
├── referentiels/
│   ├── domaines-activite.txt  (liste fermée)
│   ├── competences.txt        (liste fermée)
│   ├── certifications.txt     (liste fermée)
│   └── statuts-juridiques.txt
├── bureau/
│   ├── membres.csv            (nom, fonction, email)
│   └── photos/                (1 photo par membre, 300×300 min)
├── frise/
│   └── dates.md               (année + événement)
├── partenaires/
│   ├── liste.csv              (nom, URL)
│   └── logos/                 (SVG ou PNG transparent)
├── emails/
│   └── textes-bureau.md       (si déjà rédigés, sinon on propose)
└── urls-legacy.csv            (anciennes URLs WordPress pour redirections 301)
```

Une fois ce dossier en main + les réponses aux questions 🔴 ci-dessus, on peut lancer Claude Code sereinement.

---

## Checklist finale avant lancement

- [ ] Toutes les questions 🔴 ont une réponse
- [ ] Les 5 référentiels (§2.1 à §2.5) sont fournis
- [ ] Les textes d'e-mails (§6.2) sont prêts ou un canevas est validé
- [ ] La palette finale est tranchée (§1.2)
- [ ] Les chiffres clés réels sont fournis (§1.4)
- [ ] L'adresse d'expéditeur DNS-validable est confirmée (§6.1, §6.3)

> Quand tout est coché : on lance la phase P0 (setup repo) de l'`architecture.md`.
