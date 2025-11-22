# Naprawa zapisywania AI Coach do bazy danych

## Problem
Raw Analysis zapisuje się do bazy danych, ale AI Coach recommendations nie.

## Przyczyny

### 1. Brakuje SUPABASE_SERVICE_ROLE_KEY (GŁÓWNA PRZYCZYNA)
Aplikacja używa Row Level Security (RLS) w Supabase, które blokuje zapis AI analysis dla niezalogowanych użytkowników (np. tych z results_token).

**Kod w `app/api/analyze/route.ts` wymaga `SUPABASE_SERVICE_ROLE_KEY`** aby ominąć RLS i zapisać wyniki. Jeśli ten klucz nie jest ustawiony w Vercel, zapis nie działa.

### 2. Kolumna `recommendations` może nie istnieć
Migracja `20250121_add_recommendations_column.sql` mogła nie zostać uruchomiona w produkcyjnej bazie danych Supabase.

## Rozwiązanie

### KROK 1: Ustaw SUPABASE_SERVICE_ROLE_KEY w Vercel (KRYTYCZNE!)

**To jest NAJWAŻNIEJSZY krok!** Bez tego klucza AI Coach recommendations NIE będą się zapisywać.

1. Przejdź do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz projekt VoiceClara
3. Przejdź do **Settings** → **API** w lewym menu
4. Znajdź sekcję **Project API keys**
5. Skopiuj **`service_role` key** (NIE `anon` key!)

   ⚠️ **UWAGA:** Ten klucz jest BARDZO ważny - daje pełny dostęp do bazy! Nie udostępniaj go publicznie.

6. Przejdź do [Vercel Dashboard](https://vercel.com/dashboard)
7. Wybierz projekt VoiceClara
8. Przejdź do **Settings** → **Environment Variables**
9. Kliknij **Add New**
10. Wprowadź:
    - **Key:** `SUPABASE_SERVICE_ROLE_KEY`
    - **Value:** [wklej skopiowany service_role key]
    - **Environments:** Zaznacz **Production**, **Preview**, i **Development**
11. Kliknij **Save**
12. **REDEPLOY aplikację:** Przejdź do **Deployments** → kliknij trzy kropki przy ostatnim deployu → **Redeploy**

✅ Po redeployu AI Coach recommendations powinny zacząć się zapisywać!

---

### KROK 2: Upewnij się że kolumna `recommendations` istnieje

### Opcja A: Uruchom migrację przez Supabase Dashboard (Zalecane)

1. Przejdź do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz swój projekt VoiceClara
3. Przejdź do **SQL Editor** w lewym menu
4. Kliknij **+ New query**
5. Skopiuj i wklej zawartość pliku `/supabase/migrations/20250121_fix_recommendations_column.sql`
6. Kliknij **Run** (lub naciśnij Ctrl+Enter)
7. Sprawdź wyniki:
   - Powinno pojawić się: `Column recommendations added to ai_analysis table` (jeśli kolumna nie istniała)
   - Lub: `Column recommendations already exists in ai_analysis table` (jeśli kolumna już istniała)
8. Sprawdź dane przykładowe w wynikach zapytania

### Opcja B: Ręczne dodanie kolumny (Szybkie rozwiązanie)

Jeśli wolisz szybkie rozwiązanie, uruchom ten prosty SQL w **SQL Editor**:

```sql
-- Dodaj kolumnę recommendations jeśli nie istnieje
ALTER TABLE ai_analysis
ADD COLUMN IF NOT EXISTS recommendations JSONB;

-- Dodaj komentarz
COMMENT ON COLUMN ai_analysis.recommendations IS 'JSON object with actionable recommendations, quick wins, and red flags from AI Coach mode';

-- Sprawdź czy kolumna istnieje
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'ai_analysis'
AND column_name = 'recommendations';
```

---

### KROK 3: Sprawdź logi Vercel (Diagnostyka)

Jeśli po wykonaniu KROK 1 i 2 nadal masz problem, sprawdź logi Vercel:

1. Przejdź do [Vercel Dashboard](https://vercel.com/dashboard)
2. Wybierz projekt VoiceClara
3. Przejdź do **Logs** lub **Functions**
4. Uruchom analizę AI (kliknij "AI Analysis" w aplikacji)
5. Sprawdź logi - powinny pokazać:
   - `📊 AI Coach recommendations generated:` - czy recommendations zostały wygenerowane
   - `💾 Saving AI analysis to database...` - próba zapisu
   - `✅ Analysis saved successfully to database` - sukces
   - Lub `❌ Error saving analysis to database:` - błąd z szczegółami

## Weryfikacja

Po uruchomieniu migracji:

1. Przejdź do aplikacji VoiceClara
2. Otwórz stronę wyników (Results) dla feedback request z co najmniej 3 odpowiedziami
3. Kliknij przycisk **"AI Analysis"**
4. Po zakończeniu analizy, przełącz się na zakładkę **"AI Coach"**
5. Powinny pojawić się sekcje:
   - 🚨 **Critical Issues** (jeśli istnieją red flags)
   - ⚡ **Quick Wins** (<1 week)
   - **Prioritized Action Items** (z priorytetami HIGH/MEDIUM/LOW)

## Struktura danych AI Coach

Kolumna `recommendations` zawiera obiekt JSON z następującą strukturą:

```json
{
  "actionItems": [
    {
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "issue": "Opis problemu",
      "action": "Konkretna akcja do wykonania",
      "expectedImpact": "Oczekiwany wpływ",
      "assignTo": "Kto powinien to zrobić",
      "timeline": "Kiedy to zrobić",
      "category": "Kategoria (np. Communication)"
    }
  ],
  "quickWins": [
    "Szybkie akcje do wykonania w <1 tydzień"
  ],
  "redFlags": [
    "Poważne problemy wymagające natychmiastowej uwagi"
  ]
}
```

## Diagnostyka

### Sprawdź czy kolumna istnieje:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ai_analysis';
```

### Sprawdź istniejące dane:

```sql
SELECT
    id,
    feedback_request_id,
    themes IS NOT NULL as has_themes,
    sentiment IS NOT NULL as has_sentiment,
    summary IS NOT NULL as has_summary,
    recommendations IS NOT NULL as has_recommendations,
    analyzed_at
FROM ai_analysis
ORDER BY analyzed_at DESC
LIMIT 10;
```

### Sprawdź zawartość recommendations:

```sql
SELECT
    feedback_request_id,
    recommendations -> 'actionItems' as action_items,
    recommendations -> 'quickWins' as quick_wins,
    recommendations -> 'redFlags' as red_flags,
    analyzed_at
FROM ai_analysis
WHERE recommendations IS NOT NULL
ORDER BY analyzed_at DESC
LIMIT 5;
```

## Testowanie

Po naprawieniu:

1. Utwórz nowy feedback request
2. Dodaj co najmniej 3 odpowiedzi (prawdziwe, nie testowe)
3. Kliknij "AI Analysis"
4. Sprawdź zakładki:
   - **Raw Analysis** - powinny być: Summary, Sentiment, Themes
   - **AI Coach** - powinny być: Action Items, Quick Wins, Red Flags

## Szybkie podsumowanie (TL;DR)

**Najczęstsza przyczyna:** Brak `SUPABASE_SERVICE_ROLE_KEY` w Vercel.

**Szybkie rozwiązanie:**
1. Skopiuj `service_role` key z Supabase Dashboard → Settings → API
2. Dodaj go w Vercel → Settings → Environment Variables jako `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy aplikację w Vercel
4. Uruchom SQL migrację w Supabase SQL Editor (plik: `20250121_fix_recommendations_column.sql`)
5. Gotowe! 🎉

---

## Wsparcie

Jeśli problem nadal występuje:

1. Sprawdź logi Vercel (szczegółowe błędy)
2. Sprawdź logi Supabase (problemy z bazą danych)
3. Uruchom diagnostyczne SQL query powyżej
4. Upewnij się że `SUPABASE_SERVICE_ROLE_KEY` jest poprawnie ustawiony w Vercel (bez spacji, z pełnym kluczem)
5. Upewnij się że aplikacja została zredeploy'owana po dodaniu zmiennej

---

**Ostatnia aktualizacja:** 2025-01-22
