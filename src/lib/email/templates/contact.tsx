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

interface ContactEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Nouveau message de {name} — {subject}
      </Preview>
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
              OPEN PF — Formulaire de contact
            </Heading>
          </Section>

          <Heading as="h2" style={{ fontSize: '18px', color: '#050f2e', marginTop: 0 }}>
            {subject}
          </Heading>

          <Text style={{ color: '#333', lineHeight: '1.6', margin: '4px 0' }}>
            <strong>De&nbsp;:</strong> {name}
          </Text>
          <Text style={{ color: '#333', lineHeight: '1.6', margin: '4px 0' }}>
            <strong>Email&nbsp;:</strong> {email}
          </Text>

          <Section
            style={{
              margin: '24px 0',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              borderLeft: '4px solid #e6007e',
            }}
          >
            <Text style={{ color: '#333', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
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
            Répondez directement à cet email pour contacter {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
