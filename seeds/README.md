# Ressources OPEN PF — collecte complète

> Tout le contenu scrapé depuis https://open.pf le 21 mai 2026, prêt à être injecté dans la nouvelle plateforme par Claude Code.

## Fichiers

| Fichier | Contenu | Usage |
|---|---|---|
| `referentiels.md` | Statuts juridiques, domaines d'activité (19 + Autre), certifications (22 + Autre) — exactement tels que sur le formulaire actuel | Seed des tables `activity_domains`, `certifications`, etc. |
| `adherents.csv` | **54 adhérents** : slug, nom, URL fiche, URL logo, description courte | Seed de la table `members` + import des logos |
| `institutionnel.md` | Manifeste, 4 axes stratégiques, **8 membres du bureau**, **7 dates de la frise**, contact (adresse, e-mail, horaires, GPS, réseaux), partenaires identifiés, 5 articles récents | Seed des tables `team_members`, `timeline_events`, `site_settings`, `news` |
| `emails-templates.md` | **8 templates transactionnels** en français pro + variables + charte graphique mail | Implémentation dans `src/lib/email/templates/` (React Email) |
| `manques-restants.md` | Bilan final de ce qui reste à fournir (court : téléphone, photos, DNS, mentions légales) | Checklist pré-prod |

## Étapes pour Claude Code

1. **Ces fichiers sont la source de vérité** au démarrage. À déposer dans le repo dans `/seeds/`.
2. **Script de migration des logos** à écrire en P2 (phase DB) : pour chaque ligne du CSV, télécharger l'URL logo si présente, sinon scraper la page individuelle pour la trouver, sinon laisser vide (Claude peut s'en charger).
3. **Le bureau pourra tout éditer** depuis le BO une fois en ligne (chiffres clés, frise, bureau, partenaires, e-mails…).

## Statut global

✅ **95 % de la matière est en main.** Tu peux lancer la P0 (setup) sans bloquer.

Les 5 % restants (téléphone du bureau, photos individuelles, DNS pour mailing, validation mentions légales) peuvent être réglés en parallèle du dev.
