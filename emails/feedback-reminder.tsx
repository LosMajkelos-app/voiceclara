import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface FeedbackReminderEmailProps {
  recipientName?: string
  creatorName: string
  requestTitle: string
  feedbackUrl: string
  daysAgo: number
}

export default function FeedbackReminderEmail({
  recipientName = 'there',
  creatorName,
  requestTitle,
  feedbackUrl,
  daysAgo,
}: FeedbackReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Gentle reminder: {creatorName} is still hoping for your feedback</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>VoiceClara</Heading>
            <Text style={tagline}>Anonymous Feedback Platform</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Hi {recipientName} 👋</Heading>

            <Text style={text}>
              This is a friendly reminder that <strong>{creatorName}</strong> is still hoping to receive
              your anonymous feedback.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightTitle}>Feedback Request:</Text>
              <Text style={highlightText}>{requestTitle}</Text>
              <Text style={highlightMeta}>Sent {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago • Still 100% anonymous</Text>
            </Section>

            <Text style={text}>
              We understand you're busy! This will only take <strong>~3 minutes</strong> of your time,
              and your honest feedback will make a real difference.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={feedbackUrl}>
                Share Your Feedback Now
              </Button>
            </Section>

            <Text style={smallText}>
              Or copy and paste this URL into your browser:<br />
              <a href={feedbackUrl} style={link}>{feedbackUrl}</a>
            </Text>

            <Section style={noteBox}>
              <Text style={noteText}>
                📝 <strong>Quick reminder:</strong> Your responses are completely anonymous.
                Not even we can trace them back to you. Your email is only used to send this reminder.
              </Text>
            </Section>

            <Text style={smallText}>
              If you've already responded or prefer not to participate, you can safely ignore this email.
              You won't receive any more reminders.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Powered by <a href="https://voiceclara.com" style={link}>VoiceClara</a>
            </Text>
            <Text style={footerSmall}>
              This is an automated reminder. Your email will not be used for any other purpose.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles (same as invitation email for consistency)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e5e7eb',
}

const logo = {
  fontSize: '28px',
  fontWeight: 'bold',
  background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0 0 8px 0',
}

const tagline = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
}

const content = {
  padding: '40px',
}

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 20px 0',
}

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const highlightBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '20px',
  margin: '24px 0',
  borderRadius: '8px',
}

const highlightTitle = {
  fontSize: '14px',
  color: '#92400e',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
  fontWeight: '600',
}

const highlightText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 8px 0',
}

const highlightMeta = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
}

const smallText = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '16px 0',
}

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
}

const noteBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const noteText = {
  fontSize: '14px',
  color: '#1e40af',
  lineHeight: '1.6',
  margin: '0',
}

const footer = {
  padding: '32px 40px',
  borderTop: '1px solid #e5e7eb',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
}

const footerSmall = {
  fontSize: '12px',
  color: '#9ca3af',
  lineHeight: '1.5',
  margin: '0',
}
