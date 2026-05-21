import { neon } from '@neondatabase/serverless'

const DATABASE_URL = 'postgresql://neondb_owner:npg_bQYWPLi8H0pf@ep-cool-forest-ap238r0w.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'

const sql = neon(DATABASE_URL)

async function run() {
  console.log('🌱 Seed en cours...\n')

  // ─── News categories ───────────────────────────────────────────────────────
  console.log('📰 Catégories d\'actualités...')
  await sql`
    INSERT INTO news_categories (id, slug, label, sort_order) VALUES
      (gen_random_uuid(), 'vie-association',    'Vie de l''association',  1),
      (gen_random_uuid(), 'filiere-numerique',  'Filière numérique',      2),
      (gen_random_uuid(), 'cybersecurite',      'Cybersécurité',          3),
      (gen_random_uuid(), 'evenement',          'Événement',              4),
      (gen_random_uuid(), 'partenariat',        'Partenariat',            5),
      (gen_random_uuid(), 'communique-presse',  'Communiqué de presse',   6)
    ON CONFLICT (slug) DO NOTHING
  `

  // ─── Fetch category IDs ────────────────────────────────────────────────────
  const cats = await sql`SELECT id, slug FROM news_categories`
  const catId = Object.fromEntries(cats.map(c => [c.slug, c.id]))

  // ─── News articles ─────────────────────────────────────────────────────────
  console.log('📝 Articles...')
  await sql`
    INSERT INTO news (id, slug, title, excerpt, status, published_at, category_id) VALUES
      (gen_random_uuid(),
       'assemblee-generale-ordinaire-2025',
       'Assemblée Générale Ordinaire du 04 juillet 2025 – Nouveau CA',
       'Retour sur l''Assemblée Générale Ordinaire du 4 juillet 2025 et présentation du nouveau Conseil d''Administration d''OPEN PF.',
       'published', '2025-07-04 09:00:00+00', ${catId['vie-association']}),
      (gen_random_uuid(),
       'info-cyber-partenaires-2025',
       '« L''INFO-CYBER des partenaires » n°1 2025',
       'Publication du Commandement de la Gendarmerie pour la Polynésie française — premier numéro 2025 de la lettre d''information cybersécurité.',
       'published', '2025-05-15 09:00:00+00', ${catId['cybersecurite']}),
      (gen_random_uuid(),
       'horizons-numerique-2025',
       'Retour sur l''implication de l''OPEN PF au premier forum Les Horizons du Numérique 2025',
       'OPEN PF était présente au premier Forum Les Horizons du Numérique organisé en Polynésie française. Retour sur cet événement et les échanges qui ont eu lieu.',
       'published', '2025-04-20 09:00:00+00', ${catId['evenement']}),
      (gen_random_uuid(),
       'dematerialisation-marches-publics',
       'Dématérialisation des marchés publics en Polynésie : un réel avantage pour les entreprises locales ?',
       'Analyse de l''impact de la dématérialisation des marchés publics sur les entreprises locales du numérique en Polynésie française.',
       'published', '2025-03-10 09:00:00+00', ${catId['filiere-numerique']}),
      (gen_random_uuid(),
       'open-polynesie-meta-fenua-tntv',
       'OPEN Polynésie à l''honneur dans Meta Fenua sur TNTV',
       'L''association OPEN PF a été mise à l''honneur dans l''émission Meta Fenua diffusée sur TNTV. Retrouvez le reportage et les temps forts.',
       'published', '2025-02-05 09:00:00+00', ${catId['partenariat']})
    ON CONFLICT (slug) DO NOTHING
  `

  // ─── Timeline ──────────────────────────────────────────────────────────────
  console.log('📅 Frise chronologique...')
  await sql`
    INSERT INTO timeline_events (id, year, description, sort_order) VALUES
      (gen_random_uuid(), 2011, 'Création de l''association. Élection de Guillaume PROIA à la présidence d''OPEN PF', 1),
      (gen_random_uuid(), 2013, 'Changements de bureau et de président. Élection de Frédéric DOCK', 2),
      (gen_random_uuid(), 2015, 'Changements de bureau et de président. Élection de Vincent FABRE', 3),
      (gen_random_uuid(), 2017, 'Rapprochement avec OPEN NC (Nouvelle-Calédonie)', 4),
      (gen_random_uuid(), 2021, 'Changements de bureau et de président. Élection de Thibault DE REVIERE', 5),
      (gen_random_uuid(), 2021, 'Vision, convictions, missions — Travaux autour de la raison d''être OPEN', 6),
      (gen_random_uuid(), 2022, 'Développement de partenariats clés — CLUSIR, French Tech', 7),
      (gen_random_uuid(), 2026, 'Refonte du site et lancement de la plateforme numérique', 8)
    ON CONFLICT DO NOTHING
  `

  // ─── Team members ──────────────────────────────────────────────────────────
  console.log('👥 Bureau...')
  await sql`
    INSERT INTO team_members (id, full_name, role, sort_order, is_active) VALUES
      (gen_random_uuid(), 'DE REVIERE Thibault',    'Président',     1, true),
      (gen_random_uuid(), 'LUCAS Tuarii',            'Vice-président',2, true),
      (gen_random_uuid(), 'LATIL Frédéric',          'Secrétaire',    3, true),
      (gen_random_uuid(), 'PURAVET Sébastien',       'Trésorier',     4, true),
      (gen_random_uuid(), 'AMPOURNALES Véronique',   'Assesseur',     5, true),
      (gen_random_uuid(), 'CHABOT Florian',          'Assesseur',     6, true),
      (gen_random_uuid(), 'LEGENDRE Patrick',        'Assesseur',     7, true),
      (gen_random_uuid(), 'CHANE Alain',             'Assesseur',     8, true)
    ON CONFLICT DO NOTHING
  `

  // ─── Partners ──────────────────────────────────────────────────────────────
  console.log('🤝 Partenaires...')
  await sql`
    INSERT INTO partners (id, name, website_url, sort_order, is_active) VALUES
      (gen_random_uuid(), 'MEDEF Polynésie française', 'https://www.medef.pf', 1, true),
      (gen_random_uuid(), 'OPEN NC',                   'https://open.nc',      2, true),
      (gen_random_uuid(), 'CLUSIR Tahiti',             'https://open.pf/adherents/clusir-tahiti/', 3, true),
      (gen_random_uuid(), 'La French Tech Polynésie',  'https://open.pf/adherents/la-french-tech-polynesie/', 4, true)
    ON CONFLICT DO NOTHING
  `

  // ─── Members (54 adhérents actifs) ────────────────────────────────────────
  console.log('🏢 Adhérents (54)...')

  const members = [
    { slug: 'bbs', name: 'BBS', logo: 'https://open.pf/wp-content/uploads/2025/09/BBS-Logo-Simple-2BTrame-1200x1200.jpg', desc: "Accompagnement entreprises et institutions du fenua sur la gestion complète de SI : ingénierie systèmes et réseaux, assistance utilisateurs, cybersécurité et conseil stratégique." },
    { slug: 'clusir-tahiti', name: 'CLUSIR Tahiti', logo: 'https://open.pf/wp-content/uploads/2025/07/326535350_711841490478657_2673823807400474931_n-1200x661.png', desc: "Club de la Sécurité de l'Information Région Tahiti — association de professionnels pour l'entraide, le partage d'expériences et les bonnes pratiques de la sécurité de l'information." },
    { slug: 'oraclia-sas', name: 'ORACLIA, SAS', logo: 'https://open.pf/wp-content/uploads/2025/07/Design-sans-titre.png', desc: "Transforme l'intelligence artificielle en levier stratégique aussi naturel et indispensable que l'utilisation quotidienne des outils de travail." },
    { slug: 'fenua-online', name: 'Fenua online', logo: 'https://open.pf/wp-content/uploads/2025/07/google-business-720x720-1.png', desc: "Sites internet, solutions en ligne et ingénierie informatique sur Tahiti. Produits clés-en-main personnalisables par le service d'ingénierie logicielle." },
    { slug: 'galatea', name: 'GALATEA', logo: 'https://open.pf/wp-content/uploads/2025/05/Galatea-Io-Logo-2.png', desc: "Spécialisée dans la mesure, la collecte de données et le pilotage d'équipements à distance." },
    { slug: 'rbcs-it-advisory', name: 'RBCS – IT Advisory', logo: 'https://open.pf/wp-content/uploads/2025/04/Signature-1.png', desc: "Accompagnement en transformation numérique et optimisation du SI. Approche pragmatique orientée résultats." },
    { slug: 'foxit', name: 'FOXIT', logo: 'https://open.pf/wp-content/uploads/2025/04/TRANSPA_LOGO_FOXIT_2020-1200x1234.png', desc: "Entreprise polynésienne spécialiste en Cybersécurité et Sécurité des SI, intervient APAC, France Métropolitaine et DOM-TOM." },
    { slug: 'delta-consulting', name: 'DELTA Consulting', logo: 'https://open.pf/wp-content/uploads/2025/04/DELTA_2.3.png', desc: "Partenaire de confiance pour la transformation digitale. De la conception à la mise en œuvre, optimisation de la performance et accompagnement de l'évolution." },
    { slug: 'socredo', name: 'SOCREDO', logo: null, desc: "Créée en 1959, première banque de Polynésie française. Services bancaires et financiers efficaces et adaptés aux particuliers comme aux entreprises depuis 60 ans." },
    { slug: 'mana-cyber-pacifique', name: 'MANA CYBER PACIFIQUE', logo: 'https://open.pf/wp-content/uploads/2024/12/FullLogo-1200x960.png', desc: "Spécialisée dans l'audit, le conseil et l'accompagnement en cybersécurité, gestion des risques numériques, et conformité RGPD en Polynésie." },
    { slug: 'numeri', name: 'NŪMERI', logo: 'https://open.pf/wp-content/uploads/2024/12/logo.png', desc: "Fruit de l'association des compétences d'IDT (Innovative Digital Technologies) et du Groupe SF2i." },
    { slug: 'cnam-polynesie', name: 'Cnam Polynésie', logo: 'https://open.pf/wp-content/uploads/2024/12/logo_fb.jpg', desc: "Présent depuis 1978 en Polynésie pour permettre aux habitants de suivre des formations de l'enseignement supérieur en présentiel, distanciel ou hybride." },
    { slug: 'fortitude-services', name: 'FORTITUDE SERVICES', logo: 'https://open.pf/wp-content/uploads/2024/10/Logo_Facebook-1200x1200.png', desc: "Cabinet de conseil en gestion des risques et protection des entreprises : audit de risques, sensibilisation, gestion de crise, assurance cyber." },
    { slug: 'soram-pacifique', name: 'SORAM PACIFIQUE', logo: 'https://open.pf/wp-content/uploads/2024/10/LOGO-Soram-Pacifique-VERT.jpg', desc: "Leader vente/location de systèmes d'impression et numérisation, solutions SIRH, cybersécurité, écrans multimédia et supports de diffusion." },
    { slug: 'havae-consulting', name: "Hava'e consulting", logo: 'https://open.pf/wp-content/uploads/2024/10/Black20White20Minimalist20SImple20Monogram20Typography20Logo-1200x1200.png', desc: "Cabinet de conseil basé en Polynésie française, spécialisé dans la transformation numérique, la stratégie d'entreprise et l'optimisation des processus." },
    { slug: 'invest-in-pacific', name: 'SAS INVEST IN PACIFIC', logo: 'https://open.pf/wp-content/uploads/2024/10/logotype-IIP_FR-1200x980.jpg', desc: "Agrément AMF. Permet aux épargnants d'investir directement dans l'immobilier, les sociétés innovantes et les PME locales." },
    { slug: 'dinovox', name: 'DinoVox', logo: 'https://open.pf/wp-content/uploads/2024/09/Logo-DinoVox-v2-1-1200x450.png', desc: "1ère entreprise nativement Web3 de Polynésie. NFT, cryptomonnaies, blockchain, tokenisation, métavers, FenuaVerse." },
    { slug: 'spilog', name: 'SPILOG', logo: 'https://open.pf/wp-content/uploads/2024/07/Logo20SPILOG.png', desc: null },
    { slug: 'cabinet-alain-oziel', name: 'Cabinet Alain Oziel', logo: null, desc: null },
    { slug: 'advens', name: 'Advens', logo: 'https://open.pf/wp-content/uploads/2024/05/logo-cercle-ad_blanc-et-bleu_fond-gris_1182x1182px.png', desc: null },
    { slug: 'maraamu', name: "Mara'amu", logo: 'https://open.pf/wp-content/uploads/2024/05/Maraamu-1200x1200.png', desc: null },
    { slug: 'update-solutions', name: 'Üpdate solütions', logo: 'https://open.pf/wp-content/uploads/2024/05/UPDATE-LOGO_page-0001-1200x675.jpg', desc: null },
    { slug: 'green-tech-lab', name: 'Green/Tech/Lab', logo: 'https://open.pf/wp-content/uploads/2024/04/android-chrome-256x256-1.png', desc: "Mesure, amélioration et valorisation des impacts environnementaux des infrastructures et services IT." },
    { slug: 'foodease', name: 'Foodease', logo: 'https://open.pf/wp-content/uploads/2024/04/sans-bordure-ni-ecriture.png', desc: "1ère plateforme de livraison de restaurant et commerce du Fenua." },
    { slug: 'taiara-sarl', name: "TA'IARA SARL", logo: 'https://open.pf/wp-content/uploads/2024/04/Logo-seul-couleurs-1200x1017.png', desc: null },
    { slug: 'community-tahiti', name: 'Community Tahiti', logo: 'https://open.pf/wp-content/uploads/2024/04/FullColor_1024x1024_72dpi.png', desc: null },
    { slug: 'moana-numera', name: 'Moana Nūmera', logo: 'https://open.pf/wp-content/uploads/2024/04/logo-black-1200x261.png', desc: "Forme, accompagne et outille les organisations qui désirent transformer leur approche du numérique en respectant l'environnement, plaçant l'humain au cœur et améliorant l'efficience." },
    { slug: 'innovative-digital-technologies', name: 'Innovative Digital Technologies', logo: null, desc: "Conseil / Expertise, Distribution et intégration, Hébergement / Stockage / Cloud." },
    { slug: 'digital-tahiti', name: 'Digital Tahiti', logo: 'https://open.pf/wp-content/uploads/2023/06/Digital-Tahiti-logo-DFT2019.png', desc: null },
    { slug: 'sysnux', name: 'SysNux', logo: null, desc: null },
    { slug: 'vittoria-io', name: 'Vittoria.io', logo: null, desc: null },
    { slug: 'banque-de-tahiti', name: 'Banque de Tahiti', logo: null, desc: null },
    { slug: 'bull-sas-atos', name: 'Bull SAS, an Atos company', logo: null, desc: null },
    { slug: 'tehera', name: 'Tehera', logo: null, desc: null },
    { slug: 'tahiti-numerique', name: 'Tahiti Numérique', logo: null, desc: "Agence d'ingénierie logicielle depuis 2018 : conseil en transformation digitale, développement applications web/mobile, intégration SaaS, formations." },
    { slug: 'iaora-systems', name: 'Iaora systems', logo: 'https://open.pf/wp-content/uploads/2022/07/iaora_systems-logo-rvb_2018_796x224.jpeg', desc: "Spécialisée en services numériques : développement de logiciels et conseil RGPD." },
    { slug: 'tahiti-video-production', name: 'Tahiti Video Production', logo: null, desc: null },
    { slug: 'cegelec', name: 'Cegelec', logo: null, desc: null },
    { slug: 'oceanienne-services-business', name: 'Océanienne de Services Business', logo: 'https://open.pf/wp-content/uploads/2022/07/Design-sans-titre-1.png', desc: null },
    { slug: 'ivea', name: 'Ivea', logo: null, desc: "Regroupe 5 enseignes : Ivea Apple Premium Reseller / Centre de Services / Bose Store / Smart Store / iStore. Papeete - Centre Vaima." },
    { slug: 'te-rama', name: 'TE RAMA', logo: 'https://open.pf/wp-content/uploads/2022/05/118653317478_TERAMA-LOGO-FAB_cartouche20vert20bleu-1200x529.png', desc: null },
    { slug: 'isi-pf', name: 'ISI.PF', logo: null, desc: null },
    { slug: 'ileade', name: 'iléade', logo: null, desc: "De la gestion de projet à l'assistance MOA, du développement à l'ingénierie inversée, de l'intégration à l'éditique : large panoplie de services." },
    { slug: 'actecil-polynesie', name: 'Actecil Polynésie française', logo: null, desc: "Audit, Communication digitale, Conseil / Expertise." },
    { slug: 'la-french-tech-polynesie', name: 'La French Tech Polynésie', logo: null, desc: "Mouvement français des startups en Polynésie. Promotion de l'innovation numérique, transformation digitale, ses acteurs et porteurs de projets." },
    { slug: 'tep', name: 'TEP', logo: null, desc: "Transport d'énergie électrique en Polynésie française." },
    { slug: 'iki-consulting', name: 'iKi consulting', logo: null, desc: "Amélioration des processus et déroulement des projets. Le digital et les logiciels comme leviers d'efficience opérationnelle." },
    { slug: 'digital-techno', name: 'Digital Techno', logo: null, desc: null },
    { slug: 'b-edition', name: 'B Edition', logo: null, desc: null },
    { slug: 'polynesienne-des-eaux', name: 'Polynésienne des eaux', logo: null, desc: null },
    { slug: 'inbusol', name: 'Inbusol', logo: null, desc: null },
    { slug: 'proxi', name: '#Prox-i', logo: 'https://open.pf/wp-content/uploads/2023/12/OPEN-Pf_PROXI.png', desc: null },
    { slug: 'sas-onati', name: 'SAS ONATi', logo: null, desc: null },
    { slug: 'sf2i', name: 'SF2I', logo: null, desc: "Admin / Réseaux / Système, AMO / AMI, Audit, Conseil / Expertise, Développement logiciels." },
  ]

  let inserted = 0
  for (const m of members) {
    try {
      await sql`
        INSERT INTO members (id, slug, name, logo_url, description, status, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          ${m.slug},
          ${m.name},
          ${m.logo},
          ${m.desc},
          'active',
          NOW(),
          NOW()
        )
        ON CONFLICT (slug) DO NOTHING
      `
      inserted++
    } catch (e) {
      console.error(`  ⚠️  Erreur pour ${m.name}:`, e.message)
    }
  }
  console.log(`  ✅ ${inserted}/${members.length} adhérents insérés`)

  // ─── Verify ────────────────────────────────────────────────────────────────
  const [{ count: memberCount }] = await sql`SELECT COUNT(*) as count FROM members`
  const [{ count: newsCount }] = await sql`SELECT COUNT(*) as count FROM news`
  const [{ count: teamCount }] = await sql`SELECT COUNT(*) as count FROM team_members`

  console.log('\n✅ Seed terminé :')
  console.log(`   ${memberCount} adhérents en base`)
  console.log(`   ${newsCount} actualités en base`)
  console.log(`   ${teamCount} membres du bureau en base`)
}

run().catch(console.error)
