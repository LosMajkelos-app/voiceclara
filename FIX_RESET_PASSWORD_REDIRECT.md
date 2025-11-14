# Naprawa Password Reset Redirect URL

## Problem
Reset password link kieruje na:
```
https://voiceclara.vercel.app/en#access_token=...
```

Powinien kierować na:
```
https://voiceclara.com/auth/reset-password
```

---

## Rozwiązanie

### Krok 1: Ustaw Site URL w Supabase

1. Wejdź do Supabase Dashboard:
   - https://supabase.com/dashboard/project/gajprehuggsrpzvoefut

2. Idź do: **Authentication → URL Configuration**

3. Ustaw **Site URL** na:
   ```
   https://voiceclara.com
   ```

4. **Save**

---

### Krok 2: Dodaj Redirect URLs

W tej samej sekcji (**URL Configuration**), dodaj do **Redirect URLs**:

```
https://voiceclara.com/auth/reset-password
https://voiceclara.com/auth/callback
https://voiceclara.vercel.app/auth/reset-password
https://voiceclara.vercel.app/auth/callback
```

**WAŻNE:** Dodaj każdy URL osobno (kliknij "Add URL" dla każdego)

---

### Krok 3: Sprawdź zmienne środowiskowe w Vercel

1. Wejdź do Vercel Dashboard:
   - https://vercel.com/your-project/settings/environment-variables

2. Sprawdź czy masz zmienną:
   ```
   NEXT_PUBLIC_SITE_URL = https://voiceclara.com
   ```

3. Jeśli NIE MA lub jest inna wartość:
   - Dodaj/edytuj: `NEXT_PUBLIC_SITE_URL`
   - Wartość: `https://voiceclara.com`
   - Środowiska: **Production, Preview, Development**
   - Save

---

### Krok 4: Redeploy (jeśli zmieniłeś zmienne w Vercel)

Jeśli dodałeś/zmieniłeś `NEXT_PUBLIC_SITE_URL`:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

Lub w Vercel Dashboard:
- Deployments → ... → Redeploy

---

### Krok 5: Testuj

1. Idź na: https://voiceclara.com/auth/login
2. Kliknij "Forgot password?"
3. Wprowadź email
4. Sprawdź email - link powinien teraz kierować na:
   ```
   https://voiceclara.com/auth/reset-password
   ```

---

## Dlaczego to się stało?

Supabase używa:
1. **Site URL** - jako domyślny redirect
2. **Redirect URLs** - lista dozwolonych redirectów

Jeśli te nie są ustawione poprawnie, Supabase kieruje na domyślną domenę (vercel.app) lub dodaje `/en` (z-za next-intl).

---

## Problem z `/en` w URL

Jeśli nadal widzisz `/en` w URL, możliwe że masz skonfigurowany next-intl middleware.

Sprawdź plik `middleware.ts` lub `middleware.js` - jeśli istnieje i zawiera next-intl, to może dodawać `/en`.

**Szybkie rozwiązanie:**
W `app/auth/forgot-password/page.tsx` zmień redirectTo na:
```typescript
redirectTo: `https://voiceclara.com/auth/reset-password`
```

Zamiast:
```typescript
redirectTo: `${window.location.origin}/auth/reset-password`
```

---

## Podsumowanie kroków:

✅ **Supabase:** Site URL → `https://voiceclara.com`
✅ **Supabase:** Redirect URLs → dodaj 4 URLs
✅ **Vercel:** `NEXT_PUBLIC_SITE_URL` → `https://voiceclara.com`
✅ **Redeploy** (jeśli zmieniłeś zmienne)
✅ **Testuj**

Powinno działać! 🚀
