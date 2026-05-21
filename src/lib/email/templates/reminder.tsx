import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ReminderEmailProps {
  memberName: string
  submittedAt: Date
  adminUrl: string
}

export function ReminderEmail({ memberName, submittedAt, adminUrl }: ReminderEmailProps) {
  const submittedFormatted = submittedAt.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Html lang="fr">
      <Head />
      <Preview>Demande d&apos;adhésion en attente : {memberName}</Preview>
      <Body
        style={{ fontFamily: 'Inter, Arial, sans-serif', backgroundColor: '#f5f5f5', margin: 0 }}
      >
        <Container
          style={{
            maxWidth: '560px',
            margin: '40px auto',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '40px',
          }}
        >
          <Section
            style={{
              borderBottom: '3px solid #e6007e',
              paddingBottom: '16px',
              marginBottom: '24px',
            }}
          >
            <Heading style={{ margin: 0, fontSize: '20px', color: '#050f2e' }}>
              OPEN PF — Back-office
            </Heading>
          </Section>

          <Heading as="h2" style={{ fontSize: '18px', color: '#050f2e', marginTop: 0 }}>
            Demande en attente de validation
          </Heading>

          <Text style={{ color: '#333', lineHeight: '1.6' }}>
            La demande d&apos;adhésion de <strong>{memberName}</strong>, déposée le{' '}
            <strong>{submittedFormatted}</strong>, est toujours en attente de traitement.
          </Text>

          <Section style={{ margin: '24px 0', textAlign: 'center' as const }}>
            <a
              href={adminUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#e6007e',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '15px',
              }}
            >
              Traiter la demande →
            </a>
          </Section>

          <Text
            style={{
              fontSize: '13px',
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '16px',
              marginTop: '32px',
            }}
          >
            Cet email est envoyé automatiquement par le système OPEN PF. Ne pas répondre.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
