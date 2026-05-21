# Templates e-mails transactionnels — OPEN PF

> 8 templates pour la mécanique d'adhésion + fiche adhérent.  
> Format **MJML / React Email-compatible**, ton professionnel, mobile-friendly.  
> Tous **éditables depuis le back-office** par le bureau (section Paramètres > E-mails).  
> Variables entre accolades `{{ }}` à remplacer côté serveur.

---

## Variables communes utilisables

| Variable | Description |
|---|---|
| `{{member_name}}` | Raison sociale de l'adhérent |
| `{{contact_first_name}}` | Prénom du contact principal |
| `{{magic_link_url}}` | URL signée vers la fiche adhérent |
| `{{magic_link_expires_at}}` | Date d'expiration du lien (format jj/mm/aaaa) |
| `{{admin_url}}` | Lien vers la fiche dans le BO |
| `{{site_url}}` | https://open.pf |
| `{{support_email}}` | contact@open.pf |
| `{{annee}}` | Année courante |

---

## 1. Confirmation de réception d'une demande d'adhésion

**Destinataire** : prospect adhérent  
**Déclencheur** : juste après soumission du formulaire d'adhésion  
**Sujet** : `Votre demande d'adhésion à OPEN PF a bien été reçue`

```
Bonjour {{contact_first_name}},

Nous avons bien reçu la demande d'adhésion de {{member_name}} à OPEN — Organisation des Professionnels de l'Économie Numérique de Polynésie française.

Le bureau va l'étudier dans les prochains jours ouvrés. Vous recevrez un nouvel e-mail dès qu'elle aura été validée, avec un lien personnel pour compléter votre fiche d'adhérent (logo, descriptif, contacts, compétences…).

À très bientôt,
Le bureau OPEN PF

—
OPEN PF
Immeuble ATEIVI, 3ème étage
Rue Mgr Tepano Jaussen, BP 972
98713 Papeete – Tahiti
{{support_email}}
```

---

## 2. Notification au bureau d'une nouvelle demande

**Destinataire** : `{{admin_notification_email}}` (configuré en BO)  
**Déclencheur** : juste après soumission du formulaire d'adhésion  
**Sujet** : `🆕 Nouvelle demande d'adhésion : {{member_name}}`

```
Bonjour,

Une nouvelle demande d'adhésion vient d'être déposée sur le site OPEN PF.

Entreprise : {{member_name}}
Statut juridique : {{legal_status}}
Contact principal : {{contact_first_name}} {{contact_last_name}}
E-mail : {{contact_email}}
Téléphone : {{contact_phone}}
Domaines : {{activity_domains}}

→ Consulter et traiter la demande : {{admin_url}}

Bonne journée,
La plateforme OPEN PF
```

---

## 3. Lien magique de complétion de fiche

**Destinataire** : adhérent fraîchement validé par le bureau  
**Déclencheur** : action « Valider et envoyer le lien » dans le BO  
**Sujet** : `🎉 Bienvenue chez OPEN PF — votre fiche vous attend`

```
Bonjour {{contact_first_name}},

Bonne nouvelle : la demande d'adhésion de {{member_name}} a été validée par le bureau OPEN PF. 

Bienvenue parmi les acteurs de la filière numérique polynésienne !

Pour finaliser votre profil et apparaître dans l'annuaire public, il vous reste à compléter votre fiche d'adhérent : logo, descriptif d'activité, compétences, certifications…

→ Compléter ma fiche : {{magic_link_url}}

⏳ Ce lien personnel est valide jusqu'au {{magic_link_expires_at}}. Vous pouvez l'utiliser autant de fois que vous voulez : votre saisie est sauvegardée à chaque étape, vous pouvez quitter et revenir plus tard.

🔒 Ce lien vous est strictement personnel — ne le partagez pas.

À très vite sur la plateforme,
Le bureau OPEN PF

—
Besoin d'aide ? Une question ?
Écrivez-nous à {{support_email}}
```

---

## 4. Première relance — J+3

**Destinataire** : adhérent dont la fiche est en statut `draft` depuis 3 jours  
**Déclencheur** : CRON `/api/cron/reminders` (J+3 après l'envoi du lien initial)  
**Sujet** : `Votre fiche adhérent OPEN PF — quelques minutes pour la compléter`

```
Bonjour {{contact_first_name}},

Il y a quelques jours, nous vous avons envoyé un lien pour compléter la fiche de {{member_name}} dans l'annuaire OPEN PF.

Nous voyons qu'elle n'est pas encore finalisée. Pas de souci — quelques minutes suffisent pour ajouter votre logo, un descriptif et vos domaines d'expertise.

→ Reprendre où je m'étais arrêté : {{magic_link_url}}

Une fiche complète, c'est de la visibilité pour {{member_name}} auprès des autres acteurs du numérique polynésien, des décideurs publics et de la presse.

Bonne journée,
Le bureau OPEN PF
```

---

## 5. Relances récurrentes — toutes les semaines

**Destinataire** : adhérent dont la fiche est toujours en `draft`  
**Déclencheur** : CRON tous les 7 jours (jusqu'à soumission ou arrêt manuel par l'admin)  
**Sujet** : `Encore quelques infos à ajouter à votre fiche OPEN PF`

```
Bonjour {{contact_first_name}},

Petite relance amicale : votre fiche d'adhérent {{member_name}} n'est pas encore visible dans l'annuaire OPEN PF.

Quelques minutes suffisent pour :
- ajouter votre logo,
- décrire votre activité,
- cocher vos domaines de compétences,
- renseigner vos certifications.

→ Compléter ma fiche : {{magic_link_url}}

Si vous rencontrez une difficulté ou si vous souhaitez qu'on ne vous relance plus, écrivez-nous : {{support_email}}.

Le bureau OPEN PF
```

---

## 6. Confirmation de publication de la fiche

**Destinataire** : adhérent dont la fiche vient d'être validée par le bureau  
**Déclencheur** : action « Valider et publier » dans le BO sur la fiche soumise  
**Sujet** : `✅ Votre fiche {{member_name}} est en ligne !`

```
Bonjour {{contact_first_name}},

Votre fiche {{member_name}} a été validée par le bureau et est maintenant publique dans l'annuaire OPEN PF.

→ Voir votre fiche en ligne : {{site_url}}/adherents/{{member_slug}}

Vous pouvez la modifier à tout moment grâce au lien personnel qui vous a été transmis :
→ Modifier ma fiche : {{magic_link_url}}

Quelques bonnes pratiques pour maximiser votre visibilité :
- partagez le lien de votre fiche sur LinkedIn et vos réseaux,
- mentionnez OPEN PF dans vos communications,
- restez à l'affût des actualités du cluster : {{site_url}}/actualites

Bonne mise en lumière !
Le bureau OPEN PF
```

---

## 7. Notification de désactivation de fiche

**Destinataire** : adhérent dont la fiche vient d'être désactivée  
**Déclencheur** : action « Désactiver la fiche » dans le BO  
**Sujet** : `Votre fiche OPEN PF a été désactivée`

```
Bonjour {{contact_first_name}},

La fiche {{member_name}} a été désactivée et n'est plus visible dans l'annuaire OPEN PF.

Raison communiquée par le bureau : {{deactivation_reason}}

Si vous pensez qu'il s'agit d'une erreur ou souhaitez régulariser votre situation, contactez-nous rapidement à {{support_email}}.

Votre historique reste conservé : si vous le souhaitez, votre fiche peut être réactivée à tout moment, sans nouvelle saisie.

Cordialement,
Le bureau OPEN PF
```

---

## 8. Lien magique expiré — demande de renouvellement

**Destinataire** : adhérent qui clique sur un lien expiré  
**Déclencheur** : depuis la page « Lien expiré », bouton « Demander un nouveau lien »  
**Sujet** : `Votre nouveau lien d'accès à votre fiche OPEN PF`

```
Bonjour {{contact_first_name}},

Le lien d'accès à votre fiche {{member_name}} avait expiré. En voici un nouveau, valide jusqu'au {{magic_link_expires_at}}.

→ Accéder à ma fiche : {{magic_link_url}}

🔒 Pour des raisons de sécurité, l'ancien lien est désormais inactif. Utilisez uniquement celui-ci.

Bonne mise à jour,
Le bureau OPEN PF
```

---

## 9. (Bonus) Notification au bureau d'une fiche soumise pour validation

**Destinataire** : `{{admin_notification_email}}`  
**Déclencheur** : adhérent vient de soumettre sa fiche (passage `draft → submitted`)  
**Sujet** : `📝 Fiche à valider : {{member_name}}`

```
Bonjour,

L'adhérent {{member_name}} vient de soumettre sa fiche pour validation.

Aperçu :
- Logo : {{has_logo}}
- Description : {{description_length}} caractères
- Domaines : {{nb_domains}} sélectionnés
- Compétences : {{nb_skills}}
- Certifications : {{nb_certifications}}

→ Examiner et valider : {{admin_url}}

Délai recommandé de traitement : 48h ouvrées.

La plateforme OPEN PF
```

---

## Charte graphique des e-mails

À implémenter dans React Email :

- **Largeur max** : 600 px
- **Police corps** : `Inter`, fallback `Helvetica, Arial, sans-serif`
- **Couleur principale** (boutons CTA) : `#e6007e` (magenta OPEN)
- **Couleur texte** : `#101828`
- **Couleur texte secondaire** : `#667085`
- **Header** : logo OPEN PF (60 px de hauteur) + baseline « Organisation des Professionnels de l'Économie Numérique »
- **Footer** : adresse + mentions légales + lien désinscription pour newsletter (pas pour transactionnels)
- **Mode clair uniquement** au lancement (dark mode mail = complexe, pas prioritaire)

## Tests délivrabilité à faire avant prod

- [ ] SPF, DKIM, DMARC configurés sur le domaine `open.pf`
- [ ] Test sur Mail-tester.com → viser ≥ 9/10
- [ ] Test sur Gmail, Outlook, Apple Mail (clients principaux des adhérents PF)
- [ ] Vérifier le rendu mobile (Litmus ou équivalent)
- [ ] Header `List-Unsubscribe` pour la newsletter
