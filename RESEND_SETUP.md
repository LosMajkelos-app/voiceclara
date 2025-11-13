# Resend Email Service Setup Guide

VoiceClara uses [Resend](https://resend.com) for sending email invitations and notifications. This guide will help you set it up.

---

## Why Resend?

- ✅ **100 emails/day free** (3,000/month)
- ✅ **React Email templates** (write emails in React/TSX)
- ✅ **Simple API** - just one endpoint
- ✅ **Great deliverability** - professional infrastructure
- ✅ **Developer-friendly** - modern DX

---

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" (free, no credit card required)
3. Verify your email address

---

## Step 2: Get API Key

1. Go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it: `VoiceClara Production`
4. **Permissions**: `Full Access` (or at minimum: `Emails: Send`)
5. Click "Create"
6. **Copy the API key** (starts with `re_...`)
   - ⚠️ You can only see it once! Save it securely

---

## Step 3: Verify Your Domain (Recommended for Production)

### Option A: Use Resend's Domain (Quick Start)

For testing, you can use Resend's shared domain:
- Emails will be sent from: `onboarding@resend.dev`
- **Limitation**: Max 100 emails/day, may go to spam
- Good for: Testing and development

### Option B: Add Your Own Domain (Production)

For production with better deliverability:

1. Go to [Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `voiceclara.com`)
4. Add DNS records (provided by Resend):
   ```
   Type: TXT
   Name: @ (or your domain)
   Value: [Resend will provide]

   Type: CNAME
   Name: resend._domainkey
   Value: [Resend will provide]
   ```
5. Wait for verification (usually < 5 minutes)
6. Once verified, emails will be sent from: `feedback@voiceclara.com`

---

## Step 4: Configure VoiceClara

### For Local Development

Create `.env.local` file:

```bash
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### For Vercel Production

1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Add these variables:

   **RESEND_API_KEY**
   - Value: `re_...` (your API key)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **NEXT_PUBLIC_SITE_URL**
   - Value: `https://voiceclara.com` (your domain)
   - Environments: ✅ Production, ✅ Preview

3. Redeploy your application

---

## Step 5: Update Email "From" Address (Optional)

If you added your own domain, update the sender address in:

**File**: `app/api/send-invitations/route.ts`

```typescript
// Change this line:
from: 'VoiceClara <feedback@voiceclara.com>',

// To your verified domain:
from: 'VoiceClara <noreply@yourdomain.com>',
```

---

## Testing Email Functionality

### Test Locally

1. Start development server:
   ```bash
   npm run dev
   ```

2. Create a feedback request

3. Go to Results page

4. Click "Send Invitations" button

5. Add your own email address

6. Click "Send Invitation"

7. Check your inbox (and spam folder)

### What You Should See

You should receive a professional email that looks like this:

```
From: VoiceClara <feedback@voiceclara.com>
Subject: [Creator Name] is requesting your anonymous feedback

Hi there 👋

[Creator Name] has invited you to provide anonymous feedback...

[Beautiful HTML email with gradient header, button, etc.]
```

---

## Email Templates

VoiceClara includes 3 email templates (all in `/emails` folder):

1. **feedback-invitation.tsx**
   - Sent when someone invites people to give feedback
   - Clean, professional design
   - Emphasizes anonymity

2. **feedback-reminder.tsx**
   - Reminder for people who haven't responded
   - Friendly, non-pushy tone
   - Yellow/amber theme

3. **new-response-notification.tsx**
   - Notifies creator about new responses
   - Shows preview of answers (optional)
   - Highlights when AI analysis is available (3+ responses)

All templates are built with:
- **React Email** - write emails in React/TSX
- **Inline styles** - for maximum email client compatibility
- **Responsive** - works on mobile and desktop
- **Professional** - matches VoiceClara branding

---

## Customizing Email Templates

Templates are in `/emails` folder. To customize:

1. Edit the template file (e.g., `emails/feedback-invitation.tsx`)
2. Modify:
   - Text content
   - Colors (change hex values in style objects)
   - Layout (it's just React components!)
3. Save the file
4. Restart dev server to see changes

### Preview Emails (Optional)

Install React Email dev tools:

```bash
npm install -g react-email
cd emails
react-email dev
```

This opens a browser preview of all your email templates!

---

## Monitoring & Analytics

### Resend Dashboard

Go to [Resend Dashboard](https://resend.com/emails) to see:
- ✅ Email delivery status
- ✅ Open rates
- ✅ Click rates
- ✅ Bounces and spam reports
- ✅ API usage

### Database Tracking

VoiceClara also tracks emails in your Supabase database:
- Table: `email_invitations`
- Tracks: sent, bounced, responded status
- Access via: Supabase Dashboard → Table Editor

---

## Troubleshooting

### "Failed to send invitations"

**Possible causes**:
1. Invalid RESEND_API_KEY
   - Check it starts with `re_`
   - Verify it's set in Vercel
2. Domain not verified
   - Use `onboarding@resend.dev` for testing
   - Or verify your domain properly
3. Rate limit exceeded
   - Free tier: 100/day
   - Wait 24h or upgrade plan

### Emails going to spam

**Solutions**:
1. **Use your own verified domain**
   - Much better deliverability
   - Follow Step 3 above
2. **Warm up your domain**
   - Start with small volume
   - Gradually increase over weeks
3. **Check DNS records**
   - SPF, DKIM, DMARC properly set
   - Resend provides these automatically

### Emails not being received

**Checklist**:
1. ✅ Check spam folder
2. ✅ Verify email address is correct
3. ✅ Check Resend dashboard for delivery status
4. ✅ Try different email provider (Gmail, Outlook, etc.)
5. ✅ Check if domain is blacklisted (if using custom domain)

---

## Cost & Limits

### Free Tier
- **100 emails/day** (3,000/month)
- **1 domain**
- **Full API access**
- **Perfect for**: Testing, MVP, small projects

### Pro Plan ($20/month)
- **50,000 emails/month**
- **Unlimited domains**
- **Dedicated IP** (better deliverability)
- **Priority support**

For most VoiceClara users, **free tier is enough**!

---

## Security Best Practices

1. ✅ **Never commit API keys to Git**
   - Already in `.gitignore`
2. ✅ **Use environment variables**
   - Never hardcode in source code
3. ✅ **Rotate keys periodically**
   - Generate new key every 6-12 months
4. ✅ **Monitor usage**
   - Check Resend dashboard regularly
   - Watch for suspicious activity

---

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Discord**: https://resend.com/discord
- **VoiceClara Issues**: https://github.com/yourusername/voiceclara/issues

---

## Next Steps

After setting up Resend:

1. ✅ Test email invitations
2. ⏰ Set up reminder system (coming soon)
3. 🔔 Enable response notifications (coming soon)
4. 📊 Monitor email analytics

Happy sending! 📧
