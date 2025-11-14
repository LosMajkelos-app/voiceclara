# Naprawa błędów Auth na Vercel

## Problem
Po ostatnim pushu na Vercel dostajesz błędy:
- "Failed to send reset email: Failed to fetch" (forgot password)
- "Sign up failed: Failed to fetch" (signup)

## Rozwiązanie

### Krok 1: Sprawdź zmienne środowiskowe w Vercel

1. Wejdź na: https://vercel.com
2. Wybierz projekt VoiceClara
3. Settings → Environment Variables
4. Sprawdź czy masz WSZYSTKIE te zmienne:

```
NEXT_PUBLIC_SUPABASE_URL = https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
OPENAI_API_KEY = sk-proj-...
RESEND_API_KEY = re_...
NEXT_PUBLIC_SITE_URL = https://voiceclara.com (lub twoja domena)
```

### Krok 2: Jeśli zmiennych NIE MA lub są puste:

Dodaj je:
1. Kliknij "Add New"
2. Dodaj każdą zmienną
3. Wybierz środowiska: **Production**, **Preview**, **Development** (zaznacz wszystkie!)
4. Kliknij "Save"

### Krok 3: Zrób Redeploy

**Opcja A - Przez Dashboard:**
1. Deployments → wybierz ostatni deployment
2. Kliknij 3 kropki (•••)
3. "Redeploy"
4. Potwierdź

**Opcja B - Przez git push:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Krok 4: Poczekaj na build

Poczekaj 1-2 minuty aż Vercel zbuduje nową wersję.

### Krok 5: Przetestuj

Spróbuj ponownie:
- Sign up
- Forgot password

Powinno działać! ✅

## Dlaczego to się stało?

Wcześniej build script zawierał dummy credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
```

Te dummy values były wbudowywane w kod podczas buildu na Vercel.

Teraz usunąłem je z build script, więc Vercel musi użyć prawdziwych zmiennych środowiskowych z Dashboard.

## Jeśli dalej nie działa

Sprawdź logi buildu na Vercel:
1. Deployments → wybierz deployment
2. Kliknij "View Function Logs"
3. Poszukaj błędów związanych z Supabase
