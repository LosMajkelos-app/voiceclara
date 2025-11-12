# Custom Domain Setup for VoiceClara

This guide will help you connect your custom domain to your VoiceClara deployment on Vercel.

## Prerequisites

- A registered domain name (e.g., from Namecheap, GoDaddy, Google Domains, etc.)
- Access to your domain's DNS settings
- Your VoiceClara project deployed on Vercel

## Step 1: Add Domain in Vercel Dashboard

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your VoiceClara project
3. Click on **Settings** tab
4. Click on **Domains** in the left sidebar
5. Enter your custom domain (e.g., `voiceclara.com` or `www.voiceclara.com`)
6. Click **Add**

Vercel will provide you with DNS records to add to your domain registrar.

## Step 2: Configure DNS Records

Vercel will show you one of these configurations:

### Option A: Apex Domain (voiceclara.com)

Add an **A Record**:
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: Auto or 3600
```

### Option B: Subdomain (www.voiceclara.com)

Add a **CNAME Record**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

### Option C: Both (Recommended)

1. Add the A Record for apex domain (see Option A)
2. Add a CNAME Record for www subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

## Step 3: Update DNS at Your Domain Registrar

Go to your domain registrar's DNS management page and add the records provided by Vercel.

### Common Domain Registrars:

**Namecheap:**
1. Login to Namecheap
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add New Record

**GoDaddy:**
1. Login to GoDaddy
2. My Products → DNS
3. Add/Edit DNS Records

**Google Domains:**
1. Login to Google Domains
2. Select your domain
3. DNS tab → Custom records

**Cloudflare:**
1. Login to Cloudflare
2. Select your domain
3. DNS tab → Add record

## Step 4: Wait for DNS Propagation

- DNS changes can take **24-48 hours** to propagate worldwide
- Usually takes 5-30 minutes in practice
- You can check status at: https://www.whatsmydns.net/

## Step 5: Verify and Enable HTTPS

1. Return to Vercel dashboard → Your project → Settings → Domains
2. Vercel will automatically issue an SSL certificate (this may take a few minutes)
3. Once verified, you'll see a green checkmark ✓
4. HTTPS will be enabled automatically

## Step 6: Configure Redirects (Optional but Recommended)

If you added both apex and www domains, configure which one is primary:

1. In Vercel dashboard → Settings → Domains
2. Choose your preferred domain (e.g., `www.voiceclara.com`)
3. Click on the other domain (e.g., `voiceclara.com`)
4. Set it to **Redirect** to your primary domain

This ensures all traffic goes to one canonical URL (good for SEO).

## Environment Variables (If Needed)

If your app uses authentication or API callbacks with hardcoded URLs, update these environment variables in Vercel:

1. Settings → Environment Variables
2. Update any URLs that reference the old domain:
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
   - Supabase redirect URLs if using OAuth
   - Any API callback URLs

After updating, **redeploy** your application for changes to take effect.

## OAuth Redirect URLs (Important for Google Login)

If you're using Google OAuth, update your authorized redirect URIs:

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project
3. APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   ```
   https://yourdomain.com/auth/callback
   https://www.yourdomain.com/auth/callback
   ```
6. Save changes

Also update Supabase:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL** to your custom domain
3. Add custom domain to **Redirect URLs**

## Troubleshooting

### Domain not connecting?
- Double-check DNS records are correct
- Wait longer (DNS can take 24-48 hours)
- Use `dig yourdomain.com` or `nslookup yourdomain.com` to check DNS

### SSL certificate not issuing?
- Ensure DNS is fully propagated
- Remove any CAA records that might block Let's Encrypt
- Wait a few minutes and refresh

### Login/OAuth not working?
- Update OAuth redirect URLs in Google Cloud Console
- Update Supabase Site URL and Redirect URLs
- Redeploy app after environment variable changes

### www vs non-www issues?
- Set up proper redirects in Vercel (see Step 6)
- Ensure both domains point to Vercel

## Need Help?

- Vercel Domains Documentation: https://vercel.com/docs/concepts/projects/domains
- Vercel Support: https://vercel.com/support
- DNS Checker: https://www.whatsmydns.net/

---

**Pro Tip:** It's recommended to use the `www` subdomain as your primary domain and redirect the apex domain to it. This gives you more flexibility with DNS configuration and CDN setup.
