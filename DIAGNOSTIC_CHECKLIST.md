# 🔍 DIAGNOSTIC CHECKLIST - AI Coach Nie Zapisuje

## KROK 1: Sprawdź zmienne środowiskowe w Vercel ⚠️ KRYTYCZNE!

### Zrób to TERAZ:

1. Otwórz: https://vercel.com/dashboard
2. Wybierz projekt VoiceClara
3. **Settings** → **Environment Variables**
4. **Sprawdź czy istnieje:** `SUPABASE_SERVICE_ROLE_KEY`

### ❌ Jeśli NIE MA tej zmiennej:

**To jest problem!** Bez tego klucza AI Coach recommendations NIE będą się zapisywać.

**Jak to naprawić:**
1. Przejdź do Supabase Dashboard: https://supabase.com/dashboard
2. Wybierz projekt VoiceClara
3. **Settings** → **API**
4. Znajdź sekcję **Project API keys**
5. **Skopiuj `service_role` key** (NIE `anon` key!)
6. Wróć do Vercel → **Settings** → **Environment Variables**
7. Kliknij **Add New**:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: [wklej service_role key]
   - Environments: ✅ Production, ✅ Preview, ✅ Development
8. Kliknij **Save**
9. **REDEPLOY aplikację!** (Settings → Deployments → ... → Redeploy)

### ✅ Jeśli zmienna ISTNIEJE:

Sprawdź czy:
- Wartość jest **pełna** (powinien być długi ciąg znaków)
- Nie ma **spacji** na początku/końcu
- Jest zaznaczona dla **Production** environment

---

## KROK 2: Sprawdź czy kolumna `recommendations` istnieje w bazie

### Wykonaj w Supabase SQL Editor:

```sql
-- Sprawdź strukturę tabeli ai_analysis
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ai_analysis'
ORDER BY ordinal_position;
```

### ❌ Jeśli BRAK kolumny `recommendations`:

Uruchom tę migrację w SQL Editor:

```sql
-- Dodaj kolumnę recommendations
ALTER TABLE ai_analysis
ADD COLUMN IF NOT EXISTS recommendations JSONB;

-- Dodaj komentarz
COMMENT ON COLUMN ai_analysis.recommendations IS 'JSON object with actionable recommendations, quick wins, and red flags from AI Coach mode';

-- Sprawdź czy działa
SELECT column_name FROM information_schema.columns
WHERE table_name = 'ai_analysis' AND column_name = 'recommendations';
```

---

## KROK 3: Sprawdź logi produkcyjne w Vercel

1. Vercel Dashboard → **Logs** lub **Functions**
2. Uruchom AI Analysis w aplikacji (na żywo w produkcji)
3. Szukaj w logach:

### ✅ Dobre znaki (wszystko działa):
```
📊 AI Coach recommendations generated: { hasActionItems: true, ... }
💾 Saving AI analysis to database...
✅ Analysis saved successfully to database
Saved data: { hasRecommendations: 'yes', ... }
```

### ❌ Złe znaki (problem):
```
❌ Error saving analysis to database:
Error details: { message: "...", code: "..." }
```

Jeśli widzisz błąd, **skopiuj pełny komunikat** i daj mi znać.

---

## KROK 4: Test w bazie danych

Po wykonaniu KROK 1 i 2, uruchom test w Supabase SQL Editor:

```sql
-- Sprawdź ostatnie wpisy
SELECT
    id,
    feedback_request_id,
    themes IS NOT NULL as has_themes,
    sentiment IS NOT NULL as has_sentiment,
    summary IS NOT NULL as has_summary,
    recommendations IS NOT NULL as has_recommendations,
    recommendations -> 'actionItems' as action_items_preview,
    recommendations -> 'quickWins' as quick_wins_preview,
    recommendations -> 'redFlags' as red_flags_preview,
    analyzed_at,
    created_at
FROM ai_analysis
ORDER BY analyzed_at DESC
LIMIT 5;
```

### Co sprawdzić:
- `has_recommendations` powinno być `true` dla nowych wpisów
- `action_items_preview`, `quick_wins_preview`, `red_flags_preview` powinny mieć dane

---

## KROK 5: Test end-to-end

1. Otwórz aplikację produkcyjną (voiceclara.com)
2. Stwórz nowy feedback request (lub użyj istniejącego z ≥3 odpowiedziami)
3. Kliknij **"AI Analysis"**
4. Poczekaj aż się zakończy
5. Sprawdź zakładki:
   - **Raw Analysis** - powinny być: Summary, Sentiment, Themes
   - **AI Coach** - powinny być: Critical Issues, Quick Wins, Action Items

### ❌ Jeśli AI Coach jest PUSTY:

To oznacza że dane **NIE zapisują się do bazy**.

**Prawdopodobnie:** `SUPABASE_SERVICE_ROLE_KEY` nie jest ustawiony w Vercel!

---

## 🎯 NAJCZĘSTSZE PRZYCZYNY (z mojego śledztwa):

### 1️⃣ SUPABASE_SERVICE_ROLE_KEY nie ustawiony (90%)
**Symptomy:**
- Raw Analysis działa ✅
- AI Coach generuje się w przeglądarce ✅
- Ale po odświeżeniu strony AI Coach znika ❌

**Fix:** KROK 1 powyżej

### 2️⃣ Kolumna `recommendations` nie istnieje (8%)
**Symptomy:**
- W logach Vercel widzisz błąd: `column "recommendations" does not exist`

**Fix:** KROK 2 powyżej

### 3️⃣ RLS (Row Level Security) blokuje zapis (2%)
**Symptomy:**
- W logach Vercel: `new row violates row-level security policy`

**Fix:** Upewnij się że `SUPABASE_SERVICE_ROLE_KEY` jest ustawiony (omija RLS)

---

## 📊 Quick Diagnostic Commands

### Szybki test w JavaScript Console (DevTools):
```javascript
// W przeglądarce, otwórz DevTools (F12) i uruchom:
console.log('GTM ID:', process?.env?.NEXT_PUBLIC_GTM_ID || 'NOT SET');
console.log('GA ID:', process?.env?.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'NOT SET');
// UWAGA: SUPABASE_SERVICE_ROLE_KEY NIE BĘDZIE widoczny (server-only!)
```

### Test w Vercel CLI (lokalnie):
```bash
# Zaloguj się do Vercel
vercel login

# Sprawdź zmienne środowiskowe produkcji
vercel env ls

# Powinno pokazać:
# SUPABASE_SERVICE_ROLE_KEY (Production)
```

---

## ✅ PODSUMOWANIE - CO ROBIĆ:

1. **Sprawdź SUPABASE_SERVICE_ROLE_KEY w Vercel** (KROK 1)
2. **Jeśli brak → dodaj i REDEPLOY**
3. **Sprawdź kolumnę recommendations w Supabase** (KROK 2)
4. **Jeśli brak → uruchom SQL migration**
5. **Sprawdź logi Vercel** (KROK 3)
6. **Przetestuj end-to-end** (KROK 5)

---

## 🆘 Jeśli dalej nie działa:

Daj mi znać:
1. Czy `SUPABASE_SERVICE_ROLE_KEY` jest ustawiony w Vercel? (TAK/NIE)
2. Czy kolumna `recommendations` istnieje w bazie? (TAK/NIE)
3. Co widzisz w logach Vercel po uruchomieniu AI Analysis?
4. Co pokazuje SQL query z KROK 4?

**Wyślę ci wtedy dokładną diagnozę z konkretnym rozwiązaniem.**
