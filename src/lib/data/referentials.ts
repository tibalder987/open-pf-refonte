export const LEGAL_STATUSES = [
  { id: 'sarl', label: 'SARL' },
  { id: 'sas', label: 'SAS' },
  { id: 'sasu', label: 'SASU' },
  { id: 'eurl', label: 'EURL' },
  { id: 'sa', label: 'SA' },
  { id: 'snc', label: 'SNC' },
  { id: 'association', label: 'Association' },
  { id: 'etablissement-public', label: 'Établissement public' },
  { id: 'autre', label: 'Autre' },
] as const

export type LegalStatusId = (typeof LEGAL_STATUSES)[number]['id']

export const ACTIVITY_DOMAINS = [
  { id: 'audit', label: 'Audit & Conseil' },
  { id: 'cloud', label: 'Cloud & Hébergement' },
  { id: 'cybersecurite', label: 'Cybersécurité' },
  { id: 'developpement', label: 'Développement logiciel' },
  { id: 'distribution', label: 'Distribution & Intégration' },
  { id: 'formation', label: 'Formation & Enseignement' },
  { id: 'ia', label: 'Intelligence artificielle' },
  { id: 'infrastructure', label: 'Infrastructure & Réseaux' },
  { id: 'innovation', label: 'Innovation & Startups' },
  { id: 'marketing-digital', label: 'Marketing digital' },
  { id: 'media-numerique', label: 'Médias numériques' },
  { id: 'objets-connectes', label: 'Objets connectés & IoT' },
  { id: 'rgpd', label: 'RGPD & Conformité' },
  { id: 'services-finances', label: 'Services financiers numériques' },
  { id: 'telecom', label: 'Télécommunications' },
  { id: 'transformation-digitale', label: 'Transformation digitale' },
  { id: 'web3', label: 'Web3 & Blockchain' },
  { id: 'web-mobile', label: 'Web & Mobile' },
  { id: 'autre', label: 'Autre' },
] as const

export type ActivityDomainId = (typeof ACTIVITY_DOMAINS)[number]['id']
