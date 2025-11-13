import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import FeedbackInvitationEmail from '@/emails/feedback-invitation'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

interface InviteRecipient {
  email: string
  name?: string
}

export async function POST(request: NextRequest) {
  try {
    const { feedbackRequestId, recipients } = await request.json()

    // Validate input
    if (!feedbackRequestId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Provide feedbackRequestId and recipients array.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = recipients.filter((r: InviteRecipient) => !emailRegex.test(r.email))
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email addresses: ${invalidEmails.map((r: InviteRecipient) => r.email).join(', ')}` },
        { status: 400 }
      )
    }

    // Fetch feedback request details
    const { data: feedbackRequest, error: fetchError } = await supabase
      .from('feedback_requests')
      .select('*')
      .eq('id', feedbackRequestId)
      .single()

    if (fetchError || !feedbackRequest) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    const feedbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceclara.com'}/feedback/${feedbackRequest.share_token}`

    // Send emails
    const results = await Promise.allSettled(
      recipients.map(async (recipient: InviteRecipient) => {
        // Render email HTML
        const emailHtml = await render(
          FeedbackInvitationEmail({
            recipientName: recipient.name || recipient.email.split('@')[0],
            creatorName: feedbackRequest.creator_name,
            requestTitle: feedbackRequest.title,
            feedbackUrl: feedbackUrl,
            questionCount: feedbackRequest.questions.length,
          })
        )

        // Send via Resend
        const { data, error } = await resend.emails.send({
          from: 'VoiceClara <feedback@voiceclara.com>',
          to: recipient.email,
          subject: `${feedbackRequest.creator_name} is requesting your anonymous feedback`,
          html: emailHtml,
        })

        if (error) {
          throw new Error(`Failed to send to ${recipient.email}: ${error.message}`)
        }

        // Track invitation in database
        await supabase.from('email_invitations').insert({
          feedback_request_id: feedbackRequestId,
          recipient_email: recipient.email,
          recipient_name: recipient.name,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

        return { email: recipient.email, success: true, messageId: data?.id }
      })
    )

    // Analyze results
    const successful = results.filter(r => r.status === 'fulfilled')
    const failed = results.filter(r => r.status === 'rejected')

    return NextResponse.json({
      success: true,
      sent: successful.length,
      failed: failed.length,
      total: recipients.length,
      details: {
        successful: successful.map(r => (r as PromiseFulfilledResult<any>).value),
        failed: failed.map(r => ({
          reason: (r as PromiseRejectedResult).reason?.message || 'Unknown error'
        }))
      }
    })
  } catch (error) {
    console.error('Send invitations error:', error)
    return NextResponse.json(
      { error: 'Failed to send invitations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
