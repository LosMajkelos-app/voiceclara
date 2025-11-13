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

interface NewResponseNotificationEmailProps {
  creatorName: string
  requestTitle: string
  responseCount: number
  totalResponses: number
  resultsUrl: string
  showPreview?: boolean
  previewAnswers?: Array<{ question: string; answer: string }>
}

export default function NewResponseNotificationEmail({
  creatorName,
  requestTitle,
  responseCount = 1,
  totalResponses,
  resultsUrl,
  showPreview = false,
  previewAnswers = [],
}: NewResponseNotificationEmailProps) {
  const isFirstResponse = totalResponses === 1
  const canUseAI = totalResponses >= 3

  return (
    <Html>
      <Head />
      <Preview>
        {isFirstResponse
          ? `🎉 You got your first response for "${requestTitle}"!`
          : `${responseCount} new ${responseCount === 1 ? 'response' : 'responses'} for "${requestTitle}"`
        }
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>VoiceClara</Heading>
            <Text style={tagline}>Anonymous Feedback Platform</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              {isFirstResponse ? '🎉 ' : '✨ '}
              Hi {creatorName}!
            </Heading>

            <Text style={text}>
              {isFirstResponse ? (
                <>You received your <strong>first anonymous response</strong> for your feedback request!</>
              ) : (
                <>You have <strong>{responseCount} new {responseCount === 1 ? 'response' : 'responses'}</strong> for your feedback request!</>
              )}
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightTitle}>Feedback Request:</Text>
              <Text style={highlightText}>{requestTitle}</Text>
              <Text style={highlightMeta}>
                Total responses: {totalResponses}
                {canUseAI && ' • AI Analysis Available! ✨'}
              </Text>
            </Section>

            {canUseAI && (
              <Section style={aiBox}>
                <Text style={aiText}>
                  🤖 <strong>AI Analysis Unlocked!</strong><br />
                  With {totalResponses} responses, you can now generate AI-powered insights including:
                  <br />• Sentiment analysis<br />
                  • Key themes and patterns<br />
                  • Strengths and growth areas<br />
                  • Actionable recommendations
                </Text>
              </Section>
            )}

            {showPreview && previewAnswers.length > 0 && (
              <Section style={previewBox}>
                <Text style={previewTitle}>Quick Preview:</Text>
                {previewAnswers.slice(0, 2).map((answer, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <Text style={previewQuestion}>Q: {answer.question}</Text>
                    <Text style={previewAnswer}>
                      {answer.answer.length > 150
                        ? answer.answer.substring(0, 150) + '...'
                        : answer.answer
                      }
                    </Text>
                  </div>
                ))}
                {previewAnswers.length > 2 && (
                  <Text style={previewMore}>+ {previewAnswers.length - 2} more questions answered</Text>
                )}
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={resultsUrl}>
                {canUseAI ? 'View Results & Generate AI Analysis' : 'View Results'}
              </Button>
            </Section>

            {!canUseAI && totalResponses === 2 && (
              <Text style={smallText}>
                💡 <strong>Tip:</strong> Just one more response and you'll unlock AI-powered analysis!
              </Text>
            )}

            {!canUseAI && totalResponses === 1 && (
              <Text style={smallText}>
                💡 <strong>Tip:</strong> Share your feedback link with more people to unlock AI analysis (needs 3+ responses).
              </Text>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Powered by <a href="https://voiceclara.com" style={link}>VoiceClara</a>
            </Text>
            <Text style={footerSmall}>
              You're receiving this because someone submitted feedback for your request.
              You can manage your notification preferences in your account settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
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
  backgroundColor: '#f0fdf4',
  borderLeft: '4px solid #10b981',
  padding: '20px',
  margin: '24px 0',
  borderRadius: '8px',
}

const highlightTitle = {
  fontSize: '14px',
  color: '#065f46',
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
  color: '#065f46',
  margin: '0',
}

const aiBox = {
  backgroundColor: '#faf5ff',
  border: '2px solid #c084fc',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
}

const aiText = {
  fontSize: '14px',
  color: '#6b21a8',
  lineHeight: '1.6',
  margin: '0',
}

const previewBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
}

const previewTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  margin: '0 0 12px 0',
}

const previewQuestion = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#4f46e5',
  margin: '0 0 4px 0',
}

const previewAnswer = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0',
  fontStyle: 'italic' as const,
}

const previewMore = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '8px 0 0 0',
  fontStyle: 'italic' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#10b981',
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
