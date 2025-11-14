# Naprawa Email w Supabase (500 Error)

## Problem
```
Sign up failed: Error sending confirmation email (500)
Failed to send reset email: Error sending recovery email (500)
```

Supabase nie może wysłać emaili, ponieważ nie jest skonfigurowany email provider.

---

## Rozwiązanie: Użyj Resend jako SMTP dla Supabase

Już masz konto Resend (używasz go do invitations), więc użyjemy tego samego do Supabase auth emails!

### Krok 1: Pobierz SMTP credentials z Resend

1. Wejdź na: https://resend.com/settings/smtp
2. Skopiuj te wartości:
   ```
   Host: smtp.resend.com
   Port: 465 (lub 587)
   Username: resend
   Password: re_... (twój API key)
   ```

### Krok 2: Skonfiguruj SMTP w Supabase

1. Wejdź na: https://supabase.com/dashboard
2. Wybierz projekt VoiceClara
3. Idź do: **Authentication → Email Templates → SMTP Settings**
4. Włącz: **Enable Custom SMTP**
5. Wypełnij formularz:

```
Sender name: VoiceClara
Sender email: noreply@yourdomain.com (lub email z Resend)

Host: smtp.resend.com
Port: 465
Username: resend
Password: re_twój_api_key_z_resend

Authentication: LOGIN
Encryption: SSL/TLS
```

6. Kliknij **Save**

### Krok 3: Testuj połączenie

Supabase ma przycisk "Send Test Email" - użyj go aby sprawdzić czy działa.

### Krok 4: Przetestuj signup i reset

Teraz spróbuj:
- Sign up
- Forgot password

Powinno działać! ✅

---

## Alternatywa: Użyj domyślnego email providera Supabase

Jeśli nie chcesz konfigurować SMTP:

### Opcja A: Zweryfikuj swój email w Supabase

1. Supabase Dashboard → Authentication → Email Templates
2. Na górze powinieneś zobaczyć ostrzeżenie o niezweryfikowanym emailu
3. Kliknij "Verify email"
4. Sprawdź swoją skrzynkę i potwierdź

**UWAGA:** Domyślny provider Supabase ma limity:
- Max 3 emaile/godzinę w free tier
- Może trafiać do SPAM
- Nie zalecane na produkcji

### Opcja B: Wyłącz potwierdzenie email (NIE ZALECANE!)

Tylko do testów! NIE używaj na produkcji!

1. Supabase Dashboard → Authentication → Providers
2. Email provider → Settings
3. Wyłącz: "Confirm email"
4. Save

Użytkownicy będą mogli się rejestrować bez potwierdzenia emaila.

---

## Dlaczego to się stało?

Supabase domyślnie używa swojego email providera, ale:
- Ma bardzo niskie limity (3 emaile/h)
- Wymaga weryfikacji
- Nie jest niezawodny

Dlatego **musisz** skonfigurować własny SMTP dla produkcji.

---

## Zalecane ustawienie (SMTP z Resend)

✅ Nielimitowane emaile
✅ Wysoka dostarczalność
✅ Używasz już Resend dla invitations
✅ Jeden dostawca dla wszystkich emaili
✅ Profesjonalne

Konfiguracja zajmuje 2 minuty!

---

## Troubleshooting

### "SMTP authentication failed"
- Sprawdź czy password to twój Resend API key (zaczyna się od `re_`)
- Upewnij się że nie ma spacji na początku/końcu

### "Invalid sender email"
- Email musi być z domeny zweryfikowanej w Resend
- Albo użyj: `onboarding@resend.dev` (działa od razu, ale nie profesjonalne)

### Dalej nie działa?
1. Sprawdź logi w Supabase Dashboard → Logs
2. Sprawdź czy Resend API key jest aktywny
3. Upewnij się że Port to 465 lub 587 (nie 25!)
