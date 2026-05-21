# Ce qui manque encore — après scraping de open.pf

> Bilan final du collectage. Tout ce qui pouvait être pompé l'a été.  
> Ce document liste les **derniers items réellement indispensables** avant de lancer la prod.

---

## ✅ Ce que j'ai récupéré et que tu as déjà

| Item | État | Source |
|---|---|---|
| Référentiels statuts juridiques | ✅ Liste fermée du formulaire actuel | `referentiels.md` |
| Référentiels domaines d'activité | ✅ 19 entrées + Autre | `referentiels.md` |
| Référentiels certifications | ✅ 22 entrées + Autre | `referentiels.md` |
| Liste complète des adhérents | ✅ **54 entreprises** | `adherents.csv` |
| URLs des logos d'adhérents | ✅ 30/54 directement, 24/54 via leur page individuelle | `adherents.csv` |
| Pages individuelles des adhérents | ✅ URLs scrapables | `adherents.csv` |
| Bureau actuel | ✅ **8 personnes avec fonctions** | `institutionnel.md` |
| Frise chronologique | ✅ 7 dates clés (2011 → 2022) | `institutionnel.md` |
| Manifeste / texte d'accueil | ✅ Texte officiel actuel | `institutionnel.md` |
| 4 axes stratégiques | ✅ Tels que définis | `institutionnel.md` |
| Adresse complète | ✅ Immeuble ATEIVI, Papeete | `institutionnel.md` |
| E-mail de contact | ✅ contact@open.pf | `institutionnel.md` |
| Horaires d'ouverture | ✅ Lun-jeu 7h30-17h, ven jusqu'à 16h | `institutionnel.md` |
| Coordonnées GPS | ✅ -17.5403928, -149.5662001 | `institutionnel.md` |
| Réseaux sociaux | ✅ Facebook + LinkedIn | `institutionnel.md` |
| Partenaires (4 identifiés) | ✅ MEDEF PF, OPEN NC, CLUSIR, French Tech | `institutionnel.md` |
| 5 articles récents (URLs) | ✅ Pour redirections + seed | `institutionnel.md` |
| Archives par mois (mars 2022 → juillet 2025) | ✅ URLs scrapables | `institutionnel.md` |
| Templates e-mails | ✅ 8 templates pros + variables | `emails-templates.md` |

**Récapitulatif** : ~95 % des données institutionnelles + référentiels métier sont en main. **Claude Code peut générer un site bien plus fidèle qu'avec des données mockées.**

---

## ❌ Ce qui reste vraiment manquant (et où c'est bloquant ou pas)

### 🟠 Important — mais peut attendre la mise en ligne

#### 1. Numéro de téléphone
Le site actuel n'en affiche aucun (bug identifié dans le CDC : libellé `00 00 00`).
- **Action** : 30 secondes pour demander au bureau le numéro à afficher.
- **Workaround temporaire** : afficher uniquement l'e-mail jusqu'à confirmation.

#### 2. Photos des 8 membres du bureau
Le site actuel n'a pas de photos individuelles, juste les noms.
- **Action** : récupérer 8 photos auprès du bureau (300×300 min, fond neutre idéalement).
- **Workaround temporaire** : utiliser des initiales colorées dans un cercle (pattern déjà dans le mockup pour les placeholders). Le bureau peut uploader les photos plus tard via le BO.

#### 3. Logos en haute résolution
Les URLs scrapées pointent vers les logos actuels mais à des résolutions variables.
- **Action** : pour les ~24 adhérents sans logo visible sur la page liste, scraper leur page individuelle.
- **Workaround** : Claude Code peut récupérer automatiquement tous les logos via un script de migration depuis les URLs `open.pf/wp-content/uploads/...`.

#### 4. Logos des partenaires institutionnels
MEDEF PF, OPEN NC, CLUSIR : pas trouvés sur le site actuel en bon format.
- **Action** : les chercher (MEDEF PF est sur medef.pf, OPEN NC sur open.nc).
- **Workaround** : pas affichés au lancement, ajoutés depuis le BO une fois récupérés.

### 🟢 Confort — vraiment optionnel pour démarrer

#### 5. Contenu détaillé de chaque article
J'ai les 5 titres + URLs. Pour le contenu intégral, il faudra scraper page par page.
- **Action** : Claude Code peut écrire un script de migration WordPress → DB qui pompe les ~30 articles avec images, dates, auteurs.
- **Workaround** : ne reprendre que les 5 plus récents au lancement.

#### 6. Contenu de la page « Tremplins du Numérique »
Je ne l'ai pas scrapée. Page à fetch en plus si nécessaire.
- **Action** : tu peux me redemander de la scraper en 1 question.

#### 7. Offres d'emploi actuelles
La page existe (`nos-offres-emploi`) mais je ne l'ai pas scrapée.
- **Action** : pareil, je peux la scraper rapidement si demandé.
- **Workaround** : section vide au lancement (cohérent, les offres tournent).

### 🟢 Légal — à valider mais texte existe déjà sur le site

#### 8. Mentions légales et politique RGPD
La page existe sur `open.pf/mention`.
- **Action** : 1 fetch supplémentaire pour la copier intégralement.
- **Important** : à faire valider par le bureau avant mise en ligne, surtout si l'archi change (Vercel = US si pas région EU, etc.).

#### 9. Salariés représentés (chiffre clé manuel)
Ce chiffre n'est pas affiché sur le site actuel.
- **Action** : à demander au bureau lors du premier login en BO (champ vide par défaut, message "à renseigner").

---

## ⚠️ Décisions techniques restantes (non scrapables)

Ces points ne dépendent pas du contenu d'open.pf. Décisions de toi ou du bureau :

### 1. Adresse d'expéditeur des e-mails transactionnels
Choix possible :
- **`contact@open.pf`** (existante, simple, mais mélange transactionnel + commercial)
- **`noreply@open.pf`** (clair pour les destinataires que ce n'est pas surveillé)
- **`bureau@open.pf`** (plus humain)

→ **Recommandation** : créer `noreply@open.pf` pour les transactionnels, garder `contact@open.pf` pour la com humaine.

### 2. Accès DNS du domaine open.pf
Pour configurer SPF/DKIM/DMARC sur Brevo et garantir la délivrabilité.
- **Question** : qui gère la zone DNS de open.pf aujourd'hui ?

### 3. Durée de vie des magic links
Par défaut **30 jours**. Variants possibles :
- 7 jours (plus sûr)
- 30 jours (équilibre — proposé)
- 90 jours (plus tolérant)

→ **Recommandation** : 30 jours, avec relances hebdo. Le lien est régénérable.

### 4. Stop relances après combien d'envois ?
Sans garde-fou : illimité.
- **Recommandation** : stop automatique après **10 relances** (~10 semaines).

### 5. Authentification admin
- **Recommandation** : un compte par membre du bureau (mêmes droits), pour avoir un audit trail. 2FA optionnelle.

---

## 📋 Verdict final : prêt ou pas ?

**On peut lancer Claude Code maintenant** sans bloquer. Tu auras :

- ✅ **P0 à P3** (setup → site public statique) : impossible à mal faire — tout est cadré, données réelles disponibles
- ✅ **P4 (adhésion)** : les référentiels exacts sont en main, plus d'invention
- ✅ **P5 (fiche adhérent)** : pareil
- ✅ **P6 (back-office)** : pareil
- ✅ **P7 (cron relances)** : templates e-mails prêts, juste à éditer le ton si besoin via BO ensuite
- ⚠️ **P8 (SEO/perf/a11y)** : OK techniquement, mais redirections 301 à finaliser (URLs legacy à scraper si tu y tiens)
- ⚠️ **P9 (recette & doc)** : OK

### Les seuls vrais blocages avant mise en production publique :

1. **Téléphone à confirmer** (sinon affichage incohérent comme l'ancien site)
2. **Photos du bureau** (sinon pages "Gouvernance" moche mais fonctionnelle)
3. **DNS open.pf** (sinon les e-mails risquent de partir en spam)
4. **Mentions légales validées** (obligatoire RGPD)

**Tout le reste peut être ajouté/édité depuis le back-office après lancement.**

---

## Recommandation : lance Claude Code maintenant

Tu as 95 % de la matière. Les 5 % restants (téléphone, photos, DNS) se règlent par 3 e-mails au bureau, en parallèle du développement.

→ Demande-moi le **prompt P0 pour Claude Code** quand tu veux démarrer. Je te le génère sur-mesure pour ton repo.
