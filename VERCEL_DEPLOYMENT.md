# Vercel Deployment Guide

## ⚠️ Critical: Environment Variables Setup

After the recent update, **Supabase credentials are no longer hardcoded in the build script**. This means you **MUST** configure environment variables in Vercel for the application to work.

### Required Environment Variables

You need to set these 3 environment variables in Vercel:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - Get it from: [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api) → Project Settings → API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Get it from: [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api) → Project Settings → API

3. **OPENAI_API_KEY**
   - Your OpenAI API key
   - Starts with: `sk-...`
   - Get it from: [OpenAI Platform](https://platform.openai.com/api-keys)

---

## How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your project in Vercel Dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Add each variable:
   - Click "Add New"
   - Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the value
   - Select environments: **Production**, **Preview**, and **Development** (check all 3)
   - Click "Save"
4. Repeat for all 3 variables
5. **Redeploy** your application:
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Click "Redeploy" button

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add OPENAI_API_KEY production

# Also add for preview and development
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add OPENAI_API_KEY preview

vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add OPENAI_API_KEY development

# Redeploy
vercel --prod
```

---

## Troubleshooting

### "Login failed: Failed to fetch"
**Cause:** Environment variables are not set or set incorrectly in Vercel.

**Solution:**
1. Verify all 3 environment variables are set in Vercel
2. Check that variables are set for all environments (Production, Preview, Development)
3. Verify the values are correct (no extra spaces, complete strings)
4. Redeploy after setting variables

### "This site can't be reached" with dummy.supabase.co
**Cause:** The application was built with dummy credentials from the old build script.

**Solution:**
1. Update to the latest code (commit that removed dummy credentials from build script)
2. Set real environment variables in Vercel (see above)
3. Trigger a new deployment

### Google OAuth not working
**Cause:** Using dummy Supabase URL instead of real one.

**Solution:**
1. Set `NEXT_PUBLIC_SUPABASE_URL` in Vercel to your real Supabase project URL
2. Ensure OAuth is configured in Supabase Dashboard:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Vercel domain to "Redirect URLs"
3. Redeploy

---

## Verifying Setup

After setting environment variables and redeploying, verify:

1. ✅ Homepage loads without errors
2. ✅ Login page works (no "Failed to fetch" errors)
3. ✅ Google OAuth redirects to your Supabase instance (not dummy.supabase.co)
4. ✅ Can create feedback requests
5. ✅ AI features work (questions generation, analysis)

---

## Security Notes

- ✅ **NEXT_PUBLIC_** variables are exposed to the browser - this is expected and safe for Supabase anon keys
- ✅ **OPENAI_API_KEY** is server-only and NOT exposed to the browser
- ✅ Never commit `.env` files to Git (already in `.gitignore`)
- ✅ Use Supabase Row Level Security (RLS) policies to protect data

---

## Questions?

If you encounter issues:
1. Check Vercel deployment logs for errors
2. Verify environment variables are set correctly
3. Ensure Supabase project is active and accessible
4. Check OpenAI API key has sufficient credits
