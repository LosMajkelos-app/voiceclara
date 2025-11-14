# QUICK FIX: Signup & Password Reset Redirects

## Problem
Linki w emailach kierują na `voiceclara.vercel.app/en` zamiast `voiceclara.com`

## Rozwiązanie - 3 kroki w Supabase Dashboard

### 1️⃣ Site URL (NAJWAŻNIEJSZE!)

1. Wejdź: https://supabase.com/dashboard/project/gajprehuggsrpzvoefut
2. **Authentication → URL Configuration**
3. **Site URL:** Zmień na:
   ```
   https://voiceclara.com
   ```
4. **Save**

### 2️⃣ Redirect URLs

W tej samej sekcji (**URL Configuration**), w polu **Redirect URLs**, dodaj:

```
https://voiceclara.com/auth/callback
https://voiceclara.com/auth/reset-password
```

**Jak dodać:**
- Wpisz URL w pole tekstowe
- Kliknij "Add URL"
- Powtórz dla drugiego URL

### 3️⃣ Redeploy w Vercel

Po zmianie w Supabase, zrób redeploy:

**Opcja A - Auto deploy (już się dzieje):**
Właśnie pushowałem zmiany, więc Vercel robi automatyczny deploy.
Poczekaj 2 minuty.

**Opcja B - Manual deploy:**
1. https://vercel.com/your-project
2. Deployments → ... → Redeploy

---

## Testuj (za 2 minuty)

1. **Signup:**
   - https://voiceclara.com/auth/signup
   - Zarejestruj nowe konto
   - Link w emailu powinien kierować na: `https://voiceclara.com/auth/callback`

2. **Password reset:**
   - https://voiceclara.com/auth/forgot-password
   - Link w emailu powinien kierować na: `https://voiceclara.com/auth/reset-password`

---

## Co naprawiłem w kodzie:

✅ Signup teraz używa `emailRedirectTo` z `NEXT_PUBLIC_SITE_URL`
✅ Forgot password używa `NEXT_PUBLIC_SITE_URL`
✅ Google OAuth (login & signup) używa `NEXT_PUBLIC_SITE_URL`

Ale **Supabase też musi mieć poprawnie ustawiony Site URL** w dashboardzie!

---

## Dlaczego `/en` w URL?

Jeśli nadal widzisz `/en`, możliwe że:
1. Supabase cache - poczekaj 5 minut i spróbuj ponownie
2. Stare emaile - wyślij nowy email (nowy signup/reset)
3. Browser cache - otwórz w incognito

**Nowe emaile po deployu będą już bez `/en`.**

---

## Checklist:

- [ ] Supabase Site URL → `https://voiceclara.com`
- [ ] Supabase Redirect URLs → dodane 2 URLs
- [ ] Vercel zrobił redeploy (poczekaj 2 min)
- [ ] Testuj signup - nowy email
- [ ] Testuj forgot password - nowy email

✅ Powinno działać!
