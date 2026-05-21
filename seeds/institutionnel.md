# Contenus institutionnels OPEN PF

> Extraits du site actuel https://open.pf/qui-sommes-nous/ et https://open.pf/contact/  
> À utiliser tels quels pour le seed de la nouvelle DB.

---

## 1. Manifeste / Texte d'accueil

**Source : https://open.pf/qui-sommes-nous/**

> OPEN est née en mars 2011 sous l'impulsion de dirigeants d'entreprises passionnées par le numérique, qui ont décidé de se fédérer pour favoriser l'émergence d'une filière numérique en représentant les entreprises privées dont l'activité est directement liée à la filière ou qui la considère comme une plus-value économique.
>
> Dans l'ADN de OPEN se trouve aussi la volonté d'informer et former les entreprises adhérentes ou non des potentialités et évolutions du numérique, au regard de sa capacité forte dans le développement des entreprises de Polynésie française ainsi que de défendre les intérêts des entreprises du secteur numérique notamment auprès des institutions publiques.
>
> Pour y arriver, OPEN peut compter sur son affiliation à un organisme solide : le MEDEF Polynésie française.
>
> OPEN regroupe aujourd'hui des professionnels aux métiers transversaux, attachés à leur île au cœur du pacifique, propice à l'expérimentation, au développement et à la création de projets numériques locaux.

### Baseline / accroche
> « Avec OPEN, les différents acteurs du numérique et les entreprises s'entraident, se transforment mutuellement et contribuent à la construction de la filière numérique de notre pays. »

---

## 2. Les 4 axes stratégiques

> L'objectif est d'agir ensemble, chacun avec ses compétences, pour créer un effet global à travers les axes stratégiques suivants :

1. **Animation du réseau** — pour structurer l'écosystème polynésien, et créer des passerelles entre les acteurs.
2. **Renforcement de la filière** — pour améliorer le niveau des compétences, le financement du numérique et la représentation auprès des pouvoirs publics.
3. **Promotion du numérique** — pour sensibiliser le tissu économique au numérique et les décideurs, et pour valoriser les adhérents.
4. **Développement du business** — pour faciliter l'accession aux marchés et se positionner à l'export.

---

## 3. Bureau actuel (8 membres)

**Source : https://open.pf/qui-sommes-nous/** (section « Organisation et gouvernance »)

| Nom complet | Fonction |
|---|---|
| DE REVIERE Thibault | Président |
| LUCAS Tuarii | Vice-président |
| LATIL Frédéric | Secrétaire |
| PURAVET Sébastien | Trésorier |
| AMPOURNALES Véronique | Assesseur |
| CHABOT Florian | Assesseur |
| LEGENDRE Patrick | Assesseur |
| CHANE Alain | Assesseur |

> **À fournir par le bureau** : photo (300×300 px min) pour chacun des 8 membres.

---

## 4. Frise chronologique « Nos origines »

**Source : https://open.pf/qui-sommes-nous/**

| Année | Événement |
|---|---|
| **2011** | Création de l'association. Élection de Guillaume PROIA à la présidence d'OPEN PF |
| **2013** | Changements de bureau et de président. Élection de Frédéric DOCK |
| **2015** | Changements de bureau et de président. Élection de Vincent FABRE |
| **2017** | Rapprochement avec OPEN NC (Nouvelle-Calédonie) |
| **2021** | Changements de bureau et de président. Élection de Thibault DE REVIERE |
| **2021** | Vision, convictions, missions… Travaux autour de la raison d'être OPEN |
| **2022** | Développement de partenariats clés — CLUSIR, French Tech |

**À ajouter** (à valider avec le bureau) :
| Année | Événement (proposé) |
|---|---|
| **2024** | _Cap symbolique : 50 adhérents ?_ |
| **2026** | _Refonte du site et lancement de la plateforme numérique_ |

---

## 5. Coordonnées de l'association

**Source : https://open.pf/contact/**

| Champ | Valeur |
|---|---|
| **Raison sociale** | OPEN PF — Organisation des Professionnels de l'Économie Numérique |
| **Statut** | Association loi 1901, affiliée au MEDEF Polynésie française |
| **Adresse** | Immeuble ATEIVI, 3ème étage, Rue Mgr Tepano Jaussen, face SEFI |
| **BP** | BP 972 – 98713 Papeete (Tahiti) |
| **E-mail** | contact@open.pf |
| **Téléphone** | ⚠️ **À fournir** — le site actuel n'affiche pas de téléphone (bug identifié dans le CDC : libellé « 00 00 00 ») |
| **Coordonnées GPS** | -17.5403928, -149.5662001 |
| **Site web actuel** | https://open.pf |
| **Facebook** | https://www.facebook.com/open.polynesie/ |
| **LinkedIn** | https://www.linkedin.com/company/open-pf/ |

### Horaires d'ouverture
- Lundi à jeudi : 7h30 – 12h00, 13h30 – 17h00
- Vendredi : 7h30 – 12h00, 13h30 – 16h00
- Samedi, dimanche : fermé

---

## 6. Chiffres clés (à calculer automatiquement)

D'après ce qu'on a scrapé :

| Indicateur | Valeur observée | Mode de calcul |
|---|---|---|
| Nombre d'adhérents | **54** (sur les 6 pages de l'annuaire) | Auto : `COUNT(*) WHERE status = 'active'` |
| Nombre de domaines couverts | **19** (référentiel) | Auto : `COUNT(DISTINCT activity_domain_id)` parmi les adhérents actifs |
| Salariés représentés | _à saisir manuellement par le bureau_ | Champ libre dans le BO (`site_stats.employee_count`) |

> Le « 51 vs 65 » mentionné dans le CDC ne correspond plus à la réalité actuelle (54 fiches en ligne). C'est exactement pour ça qu'on veut un calcul auto.

---

## 7. Catégories d'actualités observées

**Sur le site actuel, les catégories sont :**
- Actualité
- Cybersécurité
- Non classé

**Recommandation pour le nouveau site** (plus structurant) :
- Vie de l'association (AG, élections, comptes-rendus)
- Filière numérique (analyses, dossiers de fond)
- Cybersécurité
- Événement (Tremplins, conférences, salons)
- Partenariat
- Communiqué de presse

---

## 8. Articles récents (à reprendre)

**Source : https://open.pf/ (sidebar « Articles récents »)**

Les 5 derniers articles publiés (URLs à archiver pour redirection 301) :

1. **Assemblée Générale Ordinaire du 04 juillet 2025 – Nouveau CA**  
   https://open.pf/assemblee-generale-ordinaire-du-04-juillet-2025-nouveau-ca/

2. **« L'INFO-CYBER des partenaires » n°1 2025**  
   https://open.pf/linfo-cyber-des-partenaires-une-publication-du-commandement-de-la-gendarmerie-pour-la-polynesie-francaise/

3. **Retour sur l'implication de l'OPEN PF au premier forum Les Horizons du Numérique 2025**  
   https://open.pf/retour-sur-limplication-de-lopen-pf-au-premier-forum-les-horizons-du-numerique-2025/

4. **Dématérialisation des marchés publics en Polynésie : un réel avantage pour les entreprises locales ?**  
   https://open.pf/dematerialisation-des-marches-publics-en-polynesie-un-reel-avantage-pour-les-entreprises-locales/

5. **OPEN Polynésie à l'honneur dans Meta Fenua sur TNTV**  
   https://open.pf/open-polynesie-a-lhonneur-dans-meta-fenua-sur-tntv/

**Plus archives mensuelles** (mars 2022 → juillet 2025) — environ 25 mois de publications à scraper si reprise complète souhaitée.

---

## 9. Partenaires identifiés

D'après ce qu'on déduit du site et du CDC :
- **MEDEF Polynésie française** — affiliation principale (logo et lien obligatoires)
- **OPEN NC** (Nouvelle-Calédonie) — rapprochement depuis 2017
- **CLUSIR Tahiti** — partenariat 2022 (aussi adhérent)
- **La French Tech Polynésie** — partenariat 2022 (aussi adhérent)
- **Gendarmerie de Polynésie française** — partenaire publications cyber

> Logos à fournir par le bureau en HD (SVG ou PNG transparent ≥ 400 px de largeur).
