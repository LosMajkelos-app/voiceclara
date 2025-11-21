# Naprawa zapisywania AI Coach do bazy danych

## Problem
Raw Analysis zapisuje się do bazy danych, ale AI Coach recommendations nie.

## Przyczyna
Kolumna `recommendations` może nie istnieć w tabeli `ai_analysis` w produkcyjnej bazie danych Supabase. Migracja `20250121_add_recommendations_column.sql` mogła nie zostać uruchomiona.

## Rozwiązanie

### Opcja 1: Uruchom migrację przez Supabase Dashboard (Zalecane)

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

### Opcja 2: Ręczne dodanie kolumny (Szybkie rozwiązanie)

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

### Opcja 3: Sprawdź logi serwera

Jeśli nadal masz problem, sprawdź logi Vercel:

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

## Wsparcie

Jeśli problem nadal występuje:

1. Sprawdź logi Vercel (szczegółowe błędy)
2. Sprawdź logi Supabase (problemy z bazą danych)
3. Uruchom diagnostyczne SQL query powyżej
4. Sprawdź czy `SUPABASE_SERVICE_ROLE_KEY` jest ustawiony w zmiennych środowiskowych Vercel

---

**Ostatnia aktualizacja:** 2025-01-21
