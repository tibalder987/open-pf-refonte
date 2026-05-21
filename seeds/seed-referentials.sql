-- Référentiels : domaines d'activité, statuts juridiques, certifications
-- Exécuter une seule fois après migration
-- pnpm exec drizzle-kit migrate && node seeds/seed-referentials.mjs

-- Domaines d'activité
INSERT INTO activity_domains (id, label, sort_order) VALUES
  ('audit','Audit & Conseil',1),('cloud','Cloud & Hébergement',2),
  ('cybersecurite','Cybersécurité',3),('developpement','Développement logiciel',4),
  ('distribution','Distribution & Intégration',5),('formation','Formation & Enseignement',6),
  ('ia','Intelligence artificielle',7),('infrastructure','Infrastructure & Réseaux',8),
  ('innovation','Innovation & Startups',9),('marketing-digital','Marketing digital',10),
  ('media-numerique','Médias numériques',11),('objets-connectes','Objets connectés & IoT',12),
  ('rgpd','RGPD & Conformité',13),('services-finances','Services financiers numériques',14),
  ('telecom','Télécommunications',15),('transformation-digitale','Transformation digitale',16),
  ('web3','Web3 & Blockchain',17),('web-mobile','Web & Mobile',18),('autre','Autre',19)
ON CONFLICT (id) DO NOTHING;

-- Statuts juridiques (UUID auto-généré)
INSERT INTO legal_statuses (id, label, sort_order) VALUES
  (gen_random_uuid(),'SARL',1),(gen_random_uuid(),'SAS',2),(gen_random_uuid(),'SASU',3),
  (gen_random_uuid(),'EURL',4),(gen_random_uuid(),'SA',5),(gen_random_uuid(),'SNC',6),
  (gen_random_uuid(),'Association',7),(gen_random_uuid(),'Établissement public',8),
  (gen_random_uuid(),'Autre',9)
ON CONFLICT (label) DO NOTHING;

-- Certifications
INSERT INTO certifications (id, label, sort_order) VALUES
  ('iso27001','ISO 27001',1),('iso9001','ISO 9001',2),('hds','HDS',3),
  ('pci-dss','PCI-DSS',4),('anssi-pssie','ANSSI / PSSIE',5),
  ('cisco','Cisco Partner',6),('microsoft','Microsoft Partner',7),
  ('aws','AWS Partner',8),('google-cloud','Google Cloud Partner',9),
  ('oscp','OSCP',10),('ceh','CEH',11),('cisa','CISA',12),('cissp','CISSP',13),
  ('rgpd-dpo','DPO certifié RGPD',14),('qualiopi','Qualiopi',15),
  ('autre','Autre (préciser)',16)
ON CONFLICT (id) DO NOTHING;
