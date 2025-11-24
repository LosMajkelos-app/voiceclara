# Fixing Supabase CORS Error

## Problem
```
Access to fetch at 'https://gajprehuggsrpzvoefut.supabase.co/rest/v1/feedback_requests'
from origin 'https://voiceclara.com' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
Supabase is blocking browser requests from voiceclara.com domain. This happens when the Supabase project doesn't have proper CORS configuration for your production domain.

## Solution

### Option 1: Check Supabase Dashboard Settings (Recommended)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/gajprehuggsrpzvoefut
2. **Navigate to**: Settings → API
3. **Check "API Settings"**:
   - Ensure the API is **enabled**
   - Verify the anon/public key is correct
4. **Check CORS Settings**:
   - Look for "Allowed origins" or CORS configuration
   - By default, Supabase should allow all origins for browser requests with anon key
   - If there's a whitelist, add:
     - `https://voiceclara.com`
     - `https://*.vercel.app` (for preview deployments)
     - `http://localhost:3000` (for local development)

### Option 2: Verify Supabase Client Configuration

The current configuration in `lib/supabase.ts` looks correct, but verify:

```typescript
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

**Important**: Make sure you're using the **anon (public) key**, NOT the service role key in the browser!

### Option 3: Check Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set for **Production**:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://gajprehuggsrpzvoefut.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public/anon key (starts with `eyJ...`)

**⚠️ CRITICAL**:
- Use `NEXT_PUBLIC_` prefix so these are available in the browser
- Use the **anon key**, NOT the service role key
- Redeploy after changing environment variables

### Option 4: Supabase RLS Policies

If CORS is working but you get empty results, check Row Level Security (RLS):

1. Go to: Database → Tables → feedback_requests
2. Check if RLS is enabled
3. For public feedback forms, you need a policy like:
```sql
-- Allow anyone to read feedback requests by share_token
CREATE POLICY "Allow public read access by share token"
ON feedback_requests
FOR SELECT
USING (true);
```

## Quick Test

Run this in browser console on voiceclara.com:
```javascript
fetch('https://gajprehuggsrpzvoefut.supabase.co/rest/v1/feedback_requests?select=*&share_token=eq.test', {
  headers: {
    'apikey': 'YOUR_ANON_KEY_HERE',
    'Authorization': 'Bearer YOUR_ANON_KEY_HERE'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

If this returns CORS error → Supabase project CORS issue
If this returns 401/403 → RLS policy issue
If this returns data → Configuration is correct!

## Common Mistakes

❌ **Using service_role key in browser** - This won't work due to CORS
✅ **Use anon/public key for browser requests**

❌ **Missing NEXT_PUBLIC_ prefix** - Variables won't be available in browser
✅ **Always use NEXT_PUBLIC_ for client-side env vars**

❌ **Not redeploying after env var changes**
✅ **Redeploy after changing environment variables**

## Still Having Issues?

Check Supabase status: https://status.supabase.com/
Contact Supabase support with:
- Project ID: gajprehuggsrpzvoefut
- Domain: voiceclara.com
- Error: CORS blocking REST API requests
