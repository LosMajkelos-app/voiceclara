# Supabase Configuration Guide for VoiceClara

This guide covers essential Supabase configuration needed for VoiceClara to work properly, including authentication URLs and email templates.

## Table of Contents
1. [Fix Email Verification URLs](#fix-email-verification-urls)
2. [Configure Authentication URLs](#configure-authentication-urls)
3. [Set Up Email Templates](#set-up-email-templates)

---

## Fix Email Verification URLs

### Problem
Email verification links are redirecting to `vercel.com/login?next=...` instead of your application's auth callback URL.

### Solution
This happens when the **Site URL** in Supabase is not configured correctly. Follow these steps:

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your VoiceClara project
3. Navigate to **Authentication** → **URL Configuration** in the left sidebar

### Step 2: Configure Site URL

Set the **Site URL** to your application's domain:

```
Production: https://voiceclara.com
Development: http://localhost:3000
```

**Important:** This is the base URL of your application, NOT a Vercel URL.

### Step 3: Configure Redirect URLs

Add these URLs to the **Redirect URLs** list (one per line):

#### For Production:
```
https://voiceclara.com/auth/callback
https://www.voiceclara.com/auth/callback
https://voiceclara.com/**
```

#### For Development:
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

**Explanation:**
- `/auth/callback` - Where email verification links redirect to
- `/**` - Wildcard to allow any path in your app (useful for OAuth providers)

### Step 4: Save Changes

Click **Save** and wait a few seconds for changes to propagate.

### Step 5: Test

1. Sign up with a new email address
2. Check the verification email
3. The link should now point to `https://yourdomain.com/auth/callback?code=...`

---

## Configure Authentication URLs

### Email Rate Limits

To prevent abuse, configure rate limits:

1. **Authentication** → **Rate Limits**
2. Set appropriate limits:
   - Email sent per hour: `10` (per user)
   - SMS sent per hour: `5` (per user)

### Session Settings

1. **Authentication** → **Settings**
2. Configure session duration:
   - **JWT Expiry**: `3600` (1 hour)
   - **Refresh Token Rotation**: Enabled
   - **Reuse Interval**: `10` seconds

---

## Set Up Email Templates

Supabase provides customizable email templates for various authentication flows. Here's how to set them up:

### Access Email Templates

1. Go to Supabase Dashboard → **Authentication** → **Email Templates**
2. You'll see templates for:
   - Confirm signup
   - Invite user
   - Magic Link
   - Change Email Address
   - Reset Password
   - Reauthentication (MFA)

---

## Email Template: Confirm Signup

**Purpose:** Sent when users sign up to verify their email address

### Template Configuration

**Subject Line:**
```
Confirm your VoiceClara account
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">VoiceClara</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Anonymous Feedback Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 50%; padding: 20px;">
          <span style="font-size: 48px;">✉️</span>
        </div>
      </div>

      <!-- Content -->
      <h2 style="color: #111827; font-size: 24px; text-align: center; margin: 0 0 16px 0;">
        Confirm Your Email Address
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
        Thank you for signing up! Click the button below to verify your email and start collecting honest, anonymous feedback.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}"
           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Confirm Email Address
        </a>
      </div>

      <!-- Alternative Link -->
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0; line-height: 1.6;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4f46e5; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <!-- Security Note -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
        <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>🔒 Security Note:</strong> If you didn't create a VoiceClara account, please ignore this email or contact support.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        This email was sent by VoiceClara
      </p>
      <p style="margin: 0;">
        Questions? Contact us at <a href="mailto:support@voiceclara.com" style="color: #4f46e5;">support@voiceclara.com</a>
      </p>
    </div>

  </div>
</body>
</html>
```

---

## Email Template: Magic Link

**Purpose:** Sent when users request passwordless login

### Template Configuration

**Subject Line:**
```
Your VoiceClara login link
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magic Link Login</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">VoiceClara</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Anonymous Feedback Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 64px;">🔑</span>
      </div>

      <!-- Content -->
      <h2 style="color: #111827; font-size: 24px; text-align: center; margin: 0 0 16px 0;">
        Your Login Link is Ready
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
        Click the button below to securely log in to your VoiceClara account. This link expires in 1 hour.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}"
           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Log In to VoiceClara
        </a>
      </div>

      <!-- Expiry Warning -->
      <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 12px; border-radius: 8px; margin: 24px 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; text-align: center;">
          ⏰ This link expires in <strong>1 hour</strong>
        </p>
      </div>

      <!-- Alternative Link -->
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0; line-height: 1.6;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4f46e5; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <!-- Security Note -->
      <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px;">
        <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>🔒 Security Alert:</strong> If you didn't request this login link, please ignore this email. Do not share this link with anyone.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        This email was sent by VoiceClara
      </p>
      <p style="margin: 0;">
        Questions? Contact us at <a href="mailto:support@voiceclara.com" style="color: #4f46e5;">support@voiceclara.com</a>
      </p>
    </div>

  </div>
</body>
</html>
```

---

## Email Template: Reset Password

**Purpose:** Sent when users request a password reset

### Template Configuration

**Subject Line:**
```
Reset your VoiceClara password
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">VoiceClara</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Anonymous Feedback Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 64px;">🔐</span>
      </div>

      <!-- Content -->
      <h2 style="color: #111827; font-size: 24px; text-align: center; margin: 0 0 16px 0;">
        Reset Your Password
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
        We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}"
           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Reset Password
        </a>
      </div>

      <!-- Expiry Warning -->
      <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 12px; border-radius: 8px; margin: 24px 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; text-align: center;">
          ⏰ This link expires in <strong>1 hour</strong>
        </p>
      </div>

      <!-- Alternative Link -->
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0; line-height: 1.6;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4f46e5; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <!-- Security Note -->
      <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px;">
        <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>🔒 Security Alert:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        This email was sent by VoiceClara
      </p>
      <p style="margin: 0;">
        Questions? Contact us at <a href="mailto:support@voiceclara.com" style="color: #4f46e5;">support@voiceclara.com</a>
      </p>
    </div>

  </div>
</body>
</html>
```

---

## Email Template: Change Email Address

**Purpose:** Sent when users change their email address

### Template Configuration

**Subject Line:**
```
Confirm your new email address
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Email Change</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">VoiceClara</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Anonymous Feedback Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 64px;">📧</span>
      </div>

      <!-- Content -->
      <h2 style="color: #111827; font-size: 24px; text-align: center; margin: 0 0 16px 0;">
        Confirm Your New Email
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
        You requested to change your email address. Click the button below to confirm this change.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}"
           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Confirm Email Change
        </a>
      </div>

      <!-- Alternative Link -->
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0; line-height: 1.6;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4f46e5; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <!-- Security Note -->
      <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px;">
        <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>🔒 Security Alert:</strong> If you didn't request this email change, please contact support immediately.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        This email was sent by VoiceClara
      </p>
      <p style="margin: 0;">
        Questions? Contact us at <a href="mailto:support@voiceclara.com" style="color: #4f46e5;">support@voiceclara.com</a>
      </p>
    </div>

  </div>
</body>
</html>
```

---

## Email Template: Invite User

**Purpose:** Sent when an existing user invites someone to join VoiceClara

### Template Configuration

**Subject Line:**
```
{{ .SenderName }} invited you to VoiceClara
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">VoiceClara</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Anonymous Feedback Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 64px;">🎉</span>
      </div>

      <!-- Content -->
      <h2 style="color: #111827; font-size: 24px; text-align: center; margin: 0 0 16px 0;">
        You're Invited to VoiceClara!
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 24px 0;">
        <strong>{{ .SenderName }}</strong> has invited you to join VoiceClara - a platform for collecting honest, anonymous feedback.
      </p>

      <!-- Benefits -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">✨ What you can do with VoiceClara:</p>
        <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Collect anonymous feedback from your team</li>
          <li>Get AI-powered insights and themes</li>
          <li>Track responses over time</li>
          <li>100% private and secure</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}"
           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Accept Invitation
        </a>
      </div>

      <!-- Alternative Link -->
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0; line-height: 1.6;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4f46e5; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        This email was sent by VoiceClara
      </p>
      <p style="margin: 0;">
        Questions? Contact us at <a href="mailto:support@voiceclara.com" style="color: #4f46e5;">support@voiceclara.com</a>
      </p>
    </div>

  </div>
</body>
</html>
```

---

## Email Template: Reauthentication (MFA)

**Purpose:** Sent when multi-factor authentication is required

### Template Configuration

**Subject Line:**
```
Confirm your identity
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Identity</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">VoiceClara</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Anonymous Feedback Platform</p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 64px;">🛡️</span>
      </div>

      <!-- Content -->
      <h2 style="color: #111827; font-size: 24px; text-align: center; margin: 0 0 16px 0;">
        Confirm Your Identity
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
        For your security, we need to confirm it's really you. Click the button below to verify your identity.
      </p>

      <!-- Verification Code (if applicable) -->
      <div style="background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Your verification code:</p>
        <p style="color: #111827; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 8px;">
          {{ .Token }}
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{ .ConfirmationURL }}"
           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          Verify Identity
        </a>
      </div>

      <!-- Expiry Warning -->
      <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 12px; border-radius: 8px; margin: 24px 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; text-align: center;">
          ⏰ This code expires in <strong>10 minutes</strong>
        </p>
      </div>

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <!-- Security Note -->
      <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px;">
        <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>🔒 Security Alert:</strong> If you didn't request this verification, someone may be trying to access your account. Please secure your account immediately.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        This email was sent by VoiceClara
      </p>
      <p style="margin: 0;">
        Questions? Contact us at <a href="mailto:support@voiceclara.com" style="color: #4f46e5;">support@voiceclara.com</a>
      </p>
    </div>

  </div>
</body>
</html>
```

---

## Testing Email Templates

After configuring your email templates:

### 1. Test in Supabase Dashboard

1. Go to **Authentication** → **Email Templates**
2. Click **Send Test Email** on each template
3. Check your inbox to verify formatting

### 2. Test in Application

1. Sign up with a new email address
2. Request password reset
3. Try magic link login
4. Verify all emails arrive with correct formatting and working links

### 3. Check Spam Folders

Ensure emails aren't landing in spam by:
- Setting up SPF, DKIM, DMARC records for your domain
- Using a professional email service (SendGrid, Postmark, etc.)
- Configuring Custom SMTP in Supabase (optional)

---

## Custom SMTP (Optional)

For better email deliverability, configure custom SMTP:

### Recommended Providers
- **SendGrid** (Free tier: 100 emails/day)
- **Postmark** (Free tier: 100 emails/month)
- **Amazon SES** (Pay as you go, very cheap)

### Setup in Supabase

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Enter your SMTP credentials:
   ```
   Host: smtp.sendgrid.net (or your provider)
   Port: 587
   Username: apikey (for SendGrid)
   Password: <your-api-key>
   Sender email: noreply@voiceclara.com
   Sender name: VoiceClara
   ```
3. Click **Save**
4. Send test email to verify

---

## Troubleshooting

### Emails not arriving?
- Check spam folder
- Verify SMTP settings
- Check Supabase logs: **Logs** → **Email Logs**
- Ensure email rate limits aren't exceeded

### Links not working?
- Verify **Site URL** is correct
- Check **Redirect URLs** include your auth callback
- Ensure HTTPS is enabled

### Email styling broken?
- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Use inline CSS only (no external stylesheets)
- Avoid advanced CSS (flexbox, grid, etc.)

---

## Next Steps

After configuring authentication and emails:

1. ✅ Set up custom domain (see [DOMAIN_SETUP.md](./DOMAIN_SETUP.md))
2. ✅ Configure email templates (this guide)
3. Test all authentication flows
4. Monitor email deliverability
5. Consider upgrading to custom SMTP for better deliverability

---

**Need Help?**

- Supabase Docs: https://supabase.com/docs/guides/auth
- Email Template Variables: https://supabase.com/docs/guides/auth/auth-email-templates
- Contact Support: support@voiceclara.com
