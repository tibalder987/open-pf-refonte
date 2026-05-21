# Référentiels métier OPEN PF

> Listes extraites du formulaire d'adhésion actuel sur https://open.pf  
> **Ces listes sont à reprendre telles quelles** dans le seed de la DB et dans le formulaire d'adhésion (étape 2 : Domaines d'activité).

---

## 1. Statuts juridiques

```
- Personne physique
- EURL
- SARL
- SNC
- SA
- Autre (champ libre)
```

**Note** : la liste actuelle est lacunaire pour la Polynésie française (manque SAS, SASU, EI, EIRL, Association, SCOP). Je recommande de l'enrichir au lancement :

```
- Personne physique / Entreprise individuelle
- EURL
- SARL
- SAS / SASU
- SA
- SNC
- Association loi 1901
- Coopérative (SCOP)
- Autre (champ libre)
```

---

## 2. Domaines d'activité

Liste fermée à 19 entrées + champ libre, telle qu'elle apparaît sur le site actuel :

```
- Droit spécialisé
- Communication digitale
- AMO / AMI
- Audit
- Conseil / Expertise
- Organisme de formation / Formateur
- Commerce et service en ligne
- Application mobile
- Développement logiciels
- Édition de logiciels
- IoT
- Sites et applis web
- Télécom et voix sur IP
- Admin / Réseaux / Système
- FAI
- Hébergement / Stockage / Cloud
- Normes / Cybersécurité
- Vente de matériels informatique et audiovisuel
- SAV
- Autre (champ libre)
```

**Pour la DB Drizzle** — table `activity_domains` :
```typescript
{ id: 'audit', label: 'Audit' },
{ id: 'amo-ami', label: 'AMO / AMI' },
{ id: 'cloud', label: 'Hébergement / Stockage / Cloud' },
// etc.
```

---

## 3. Compétences & certifications

Liste fermée à 22 entrées + champ libre, telle qu'elle apparaît sur le site actuel.

**Attention** : sur le site actuel, ces items sont étiquetés « Compétences » mais ce sont en réalité des **certifications professionnelles**. Je recommande de séparer en deux référentiels distincts dans la nouvelle DB.

### 3.a Certifications (extraites du site existant)

```
- Agrément DFP
- CARUBA
- CCISO
- CCNA
- CEH (Certified Ethical Hacker)
- Certification Google Ads (Publicité sur le Réseau de Recherche)
- Certification Google Analytics IQ
- CEVOC
- HFI
- CISCO
- CISSP
- CSNAH
- PEITIL V3
- Microsoft 365 Fundamentals
- Microsoft Most Valuable Professional (MVP)
- Offensive Security Certified Expert (OSCE)
- OSCP
- QSWP
- QCSSA
- GE
- SCRUM Master
- Teams Administration Associate
- Autre (champ libre, blocs +/− répétables)
```

### 3.b Compétences techniques (recommandation : référentiel à créer en plus)

À discuter au lancement — référentiel suggéré pour qualifier les profils :
```
- Développement front (React, Vue, Angular)
- Développement back (Node.js, Python, Java, PHP, .NET)
- DevOps / CI-CD
- Cloud (AWS, Azure, GCP, OVH)
- Mobile (iOS, Android, Flutter, React Native)
- Data / BI
- IA / Machine Learning
- Cybersécurité offensive
- Cybersécurité défensive (SOC, SIEM)
- UX / UI Design
- Gestion de projet / Scrum
- Référencement SEO / SEA
```

---

## 4. Champ libre « Présentation »

Limite indiquée sur le site actuel : **« 10 lignes maximum »**.
En base : `text` non-contraint, mais validation client à `~500 caractères`.

---

## 5. Type de contact (étape 3)

Sur le site actuel, le formulaire collecte « la (les) personne(s) contact(s) qui recevront les communications par email ». Plusieurs contacts possibles.

Structure DB suggérée :
```sql
CREATE TABLE member_contacts (
  id uuid PRIMARY KEY,
  member_id uuid REFERENCES members(id),
  name varchar(120) NOT NULL,
  role varchar(120),
  email varchar(255) NOT NULL,
  phone varchar(50),
  is_primary boolean DEFAULT false
);
```
