# Supabase Auth Email Templates Guide

VoiceClara uses Supabase's built-in authentication system which automatically sends:
- **Email confirmation** emails when users sign up
- **Password reset** emails when users request password recovery

This guide shows you how to customize these email templates to match VoiceClara branding.

---

## What Emails Does Supabase Send?

Supabase automatically sends these auth emails:

1. **Confirm Signup** - Sent when a new user registers
2. **Magic Link** - Sent for passwordless login (if enabled)
3. **Change Email Address** - Sent when user changes email
4. **Reset Password** - Sent when user requests password reset

---

## How to Customize Email Templates

### Step 1: Access Email Templates

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication → Email Templates**
4. You'll see 4 email templates you can customize

### Step 2: Customize Each Template

For each template, you can customize:
- **Subject line** - The email subject
- **Email body (HTML)** - The full email content with HTML styling
- **Variables** - Dynamic data like `{{ .ConfirmationURL }}`, `{{ .Email }}`, etc.

---

## VoiceClara Branded Email Templates

Below are professionally designed email templates for VoiceClara that you can copy/paste into Supabase.

### 1. Confirm Signup Email

**Subject:**
```
Confirm your VoiceClara account
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                VoiceClara
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                Anonymous Feedback Platform
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
                Welcome to VoiceClara! 🎉
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Thanks for signing up! We're excited to have you on board. To get started, please confirm your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 32px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">
                      <strong>What's next?</strong><br>
                      • Create your first feedback request<br>
                      • Get AI-powered insights automatically<br>
                      • Send invitations to collect anonymous feedback
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <p style="margin: 24px 0 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #667eea; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                This email was sent to <strong>{{ .Email }}</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © 2025 VoiceClara. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 2. Reset Password Email

**Subject:**
```
Reset your VoiceClara password
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                VoiceClara
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                Anonymous Feedback Platform
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
                Reset Your Password 🔒
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                We received a request to reset your password for your VoiceClara account. Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 32px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5;">
                      <strong>⚠️ Security Notice:</strong><br>
                      • This link expires in <strong>1 hour</strong><br>
                      • If you didn't request this, please ignore this email<br>
                      • Your password will remain unchanged
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <p style="margin: 24px 0 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #667eea; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                This email was sent to <strong>{{ .Email }}</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © 2025 VoiceClara. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 3. Change Email Address

**Subject:**
```
Confirm your new email address
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                VoiceClara
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                Anonymous Feedback Platform
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
                Confirm Email Change 📧
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                You requested to change your email address. Click the button below to confirm this change.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 32px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                      Confirm New Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">
                      <strong>New email address:</strong><br>
                      {{ .Email }}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <p style="margin: 24px 0 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #667eea; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                If you didn't request this change, please contact support
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © 2025 VoiceClara. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Available Template Variables

Supabase provides these variables you can use in your templates:

- `{{ .Email }}` - The user's email address
- `{{ .ConfirmationURL }}` - The confirmation/magic link URL
- `{{ .Token }}` - The raw token (if you need to build custom URLs)
- `{{ .TokenHash }}` - Hashed version of the token
- `{{ .SiteURL }}` - Your site URL (from Supabase settings)

---

## Testing Your Email Templates

### Method 1: Preview in Supabase Dashboard

1. Edit your email template
2. Click the **Preview** button
3. You'll see how the email looks with sample data

### Method 2: Test with Real Signup

1. Create a test account using a real email you control
2. Check your inbox for the confirmation email
3. Verify it looks correct and links work

### Method 3: Use Email Testing Services

Use these services to test across different email clients:
- [Litmus](https://litmus.com) - Professional email testing
- [Email on Acid](https://www.emailonacid.com) - Cross-client testing
- [Mailtrap](https://mailtrap.io) - Free email testing sandbox

---

## Customization Tips

### 1. Colors

VoiceClara brand colors:
```css
Primary Purple: #667eea
Secondary Purple: #764ba2
Success Green: #10b981
Warning Yellow: #f59e0b
Error Red: #ef4444
```

### 2. Responsive Design

The templates above are mobile-responsive. Key techniques:
- Use tables for layout (best email client compatibility)
- Set `max-width: 600px` for main container
- Use `padding` instead of `margin` for spacing
- Test on mobile devices

### 3. Email Client Compatibility

These templates work across:
- ✅ Gmail (Web, iOS, Android)
- ✅ Apple Mail (iOS, macOS)
- ✅ Outlook (Web, Desktop, iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Other major clients

---

## Redirect URLs Configuration

### Step 1: Set Site URL

1. Go to: **Authentication → URL Configuration**
2. Set **Site URL** to your production URL:
   - Production: `https://voiceclara.com`
   - Development: `http://localhost:3000`

### Step 2: Add Redirect URLs

Add these to **Redirect URLs** list:
```
https://voiceclara.com/auth/callback
https://voiceclara.com/auth/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

---

## Troubleshooting

### Emails not being sent

**Check:**
1. ✅ Supabase project is active
2. ✅ SMTP is configured (or using Supabase's built-in email)
3. ✅ Email rate limits not exceeded
4. ✅ User's email is valid

### Emails going to spam

**Solutions:**
1. **Use custom SMTP** (recommended for production)
   - Go to: **Authentication → SMTP Settings**
   - Configure with your email provider (SendGrid, Mailgun, etc.)
2. **Warm up your domain** gradually
3. **Add SPF/DKIM records** if using custom SMTP

### Links not working

**Check:**
1. ✅ Site URL is correct in Supabase settings
2. ✅ Redirect URLs are whitelisted
3. ✅ Using `{{ .ConfirmationURL }}` variable correctly
4. ✅ Links not expired (1 hour timeout)

### Template variables not rendering

**Ensure:**
1. ✅ Using correct syntax: `{{ .VariableName }}`
2. ✅ Variable names are exact (case-sensitive)
3. ✅ Not using undefined variables

---

## Custom SMTP Configuration (Optional)

For better deliverability in production, configure custom SMTP:

### Step 1: Choose Email Provider

Popular options:
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **Amazon SES** - Pay as you go, very cheap
- **Resend** - You're already using this for invitations!

### Step 2: Configure in Supabase

1. Go to: **Authentication → SMTP Settings**
2. Enable **Custom SMTP**
3. Enter your SMTP credentials:
   ```
   Host: smtp.example.com
   Port: 587
   Username: your_username
   Password: your_password
   Sender email: noreply@voiceclara.com
   Sender name: VoiceClara
   ```
4. Click **Save**
5. Send test email to verify

---

## Email Analytics

Track email performance:

### Supabase Dashboard
- Go to: **Authentication → Users**
- See confirmation status for each user
- Filter by confirmed/unconfirmed

### Custom Analytics
Add UTM parameters to links in your emails:
```html
<a href="{{ .ConfirmationURL }}&utm_source=email&utm_medium=auth&utm_campaign=confirmation">
  Confirm Email
</a>
```

Track in Google Analytics or your analytics platform.

---

## Security Best Practices

1. ✅ **Expire links after 1 hour** (default Supabase behavior)
2. ✅ **Use HTTPS** for all redirect URLs
3. ✅ **Validate email domains** (avoid disposable emails)
4. ✅ **Rate limit** signup attempts (Supabase does this automatically)
5. ✅ **Monitor** for suspicious activity

---

## Next Steps

After customizing your email templates:

1. ✅ Test signup flow end-to-end
2. ✅ Test password reset flow
3. ✅ Verify emails look good on mobile
4. ✅ Check spam folder placement
5. ✅ Configure custom SMTP for production
6. ✅ Monitor email delivery rates

---

## Support

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Email Templates**: https://supabase.com/docs/guides/auth/auth-email-templates
- **SMTP Configuration**: https://supabase.com/docs/guides/auth/auth-smtp

---

Happy emailing! 📧
