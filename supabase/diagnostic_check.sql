-- ============================================
-- DIAGNOSTIC CHECK FOR AI COACH RECOMMENDATIONS
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor
-- This will show you exactly what's wrong

\echo '========================================='
\echo '🔍 DIAGNOSTIC CHECK FOR AI COACH'
\echo '========================================='
\echo ''

-- ============================================
-- CHECK 1: Does recommendations column exist?
-- ============================================
\echo '📋 CHECK 1: Column Structure'
\echo '-----------------------------------------'

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'ai_analysis'
ORDER BY ordinal_position;

\echo ''
\echo '✅ Expected: You should see "recommendations" with type "jsonb"'
\echo '❌ If missing: Run the migration from 20250121_fix_recommendations_column.sql'
\echo ''

-- ============================================
-- CHECK 2: What data exists in ai_analysis?
-- ============================================
\echo '📊 CHECK 2: Existing Data'
\echo '-----------------------------------------'

SELECT
    id,
    feedback_request_id,
    themes IS NOT NULL as has_themes,
    sentiment IS NOT NULL as has_sentiment,
    summary IS NOT NULL as has_summary,
    recommendations IS NOT NULL as has_recommendations,
    response_count_at_analysis,
    analyzed_at,
    created_at
FROM ai_analysis
ORDER BY analyzed_at DESC
LIMIT 10;

\echo ''
\echo '✅ Expected: Recent rows should have has_recommendations = true'
\echo '❌ If false: AI Coach data is NOT being saved'
\echo ''

-- ============================================
-- CHECK 3: Sample recommendations data
-- ============================================
\echo '🎯 CHECK 3: Sample Recommendations Content'
\echo '-----------------------------------------'

SELECT
    feedback_request_id,
    jsonb_array_length(recommendations -> 'actionItems') as action_items_count,
    jsonb_array_length(recommendations -> 'quickWins') as quick_wins_count,
    jsonb_array_length(recommendations -> 'redFlags') as red_flags_count,
    recommendations -> 'actionItems' -> 0 -> 'priority' as first_action_priority,
    recommendations -> 'actionItems' -> 0 -> 'issue' as first_action_issue,
    analyzed_at
FROM ai_analysis
WHERE recommendations IS NOT NULL
ORDER BY analyzed_at DESC
LIMIT 5;

\echo ''
\echo '✅ Expected: You should see counts > 0 for recent analyses'
\echo '❌ If empty result: No recommendations have been saved yet'
\echo ''

-- ============================================
-- CHECK 4: RLS Policies on ai_analysis
-- ============================================
\echo '🔒 CHECK 4: Row Level Security Policies'
\echo '-----------------------------------------'

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'ai_analysis'
ORDER BY policyname;

\echo ''
\echo '✅ Expected: You should see INSERT and UPDATE policies'
\echo 'ℹ️  Note: If SUPABASE_SERVICE_ROLE_KEY is set in Vercel, these are bypassed'
\echo ''

-- ============================================
-- CHECK 5: Recent feedback_requests with analysis
-- ============================================
\echo '🔗 CHECK 5: Feedback Requests with AI Analysis'
\echo '-----------------------------------------'

SELECT
    fr.id as request_id,
    fr.created_at as request_created,
    (SELECT COUNT(*) FROM responses WHERE feedback_request_id = fr.id) as response_count,
    aa.id IS NOT NULL as has_analysis,
    aa.recommendations IS NOT NULL as has_recommendations,
    aa.analyzed_at
FROM feedback_requests fr
LEFT JOIN ai_analysis aa ON aa.feedback_request_id = fr.id
ORDER BY fr.created_at DESC
LIMIT 10;

\echo ''
\echo '✅ Expected: Requests with ≥3 responses should have has_analysis = true'
\echo '❌ If has_recommendations = false: AI Coach is NOT saving'
\echo ''

-- ============================================
-- CHECK 6: Full recommendations example
-- ============================================
\echo '📄 CHECK 6: Full Recommendations Example (Latest)'
\echo '-----------------------------------------'

SELECT
    feedback_request_id,
    jsonb_pretty(recommendations) as recommendations_json,
    analyzed_at
FROM ai_analysis
WHERE recommendations IS NOT NULL
ORDER BY analyzed_at DESC
LIMIT 1;

\echo ''
\echo '✅ Expected: You should see a JSON object with actionItems, quickWins, redFlags'
\echo '❌ If empty: No recommendations data in database'
\echo ''

-- ============================================
-- SUMMARY
-- ============================================
\echo '========================================='
\echo '📊 SUMMARY'
\echo '========================================='

DO $$
DECLARE
    column_exists boolean;
    total_analyses integer;
    analyses_with_recommendations integer;
    latest_analysis_date timestamptz;
BEGIN
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ai_analysis'
        AND column_name = 'recommendations'
    ) INTO column_exists;

    -- Count analyses
    SELECT COUNT(*) INTO total_analyses FROM ai_analysis;
    SELECT COUNT(*) INTO analyses_with_recommendations FROM ai_analysis WHERE recommendations IS NOT NULL;
    SELECT MAX(analyzed_at) INTO latest_analysis_date FROM ai_analysis WHERE recommendations IS NOT NULL;

    RAISE NOTICE '';
    RAISE NOTICE '🔍 Diagnostics:';
    RAISE NOTICE '================';
    RAISE NOTICE '';
    RAISE NOTICE 'Column "recommendations" exists: %', column_exists;
    RAISE NOTICE 'Total AI analyses: %', total_analyses;
    RAISE NOTICE 'Analyses with recommendations: % (%.1f%%)',
        analyses_with_recommendations,
        CASE WHEN total_analyses > 0
            THEN (analyses_with_recommendations::float / total_analyses::float * 100)
            ELSE 0
        END;
    RAISE NOTICE 'Latest analysis with recommendations: %',
        COALESCE(latest_analysis_date::text, 'NEVER');
    RAISE NOTICE '';

    -- Diagnose issues
    IF NOT column_exists THEN
        RAISE NOTICE '❌ PROBLEM FOUND: Column "recommendations" does NOT exist!';
        RAISE NOTICE '';
        RAISE NOTICE '🔧 FIX: Run this SQL:';
        RAISE NOTICE '    ALTER TABLE ai_analysis ADD COLUMN IF NOT EXISTS recommendations JSONB;';
        RAISE NOTICE '';
    ELSIF analyses_with_recommendations = 0 AND total_analyses > 0 THEN
        RAISE NOTICE '❌ PROBLEM FOUND: AI analyses exist but NO recommendations are saved!';
        RAISE NOTICE '';
        RAISE NOTICE '🔧 LIKELY CAUSE: SUPABASE_SERVICE_ROLE_KEY not set in Vercel';
        RAISE NOTICE '';
        RAISE NOTICE '🔧 FIX:';
        RAISE NOTICE '    1. Go to Supabase Dashboard → Settings → API';
        RAISE NOTICE '    2. Copy the "service_role" key';
        RAISE NOTICE '    3. Go to Vercel → Settings → Environment Variables';
        RAISE NOTICE '    4. Add: SUPABASE_SERVICE_ROLE_KEY = [your service_role key]';
        RAISE NOTICE '    5. Redeploy the application';
        RAISE NOTICE '';
    ELSIF analyses_with_recommendations > 0 THEN
        RAISE NOTICE '✅ LOOKS GOOD: Recommendations are being saved successfully!';
        RAISE NOTICE '';
        RAISE NOTICE 'ℹ️  If AI Coach is still not showing in the app:';
        RAISE NOTICE '    1. Check browser DevTools console for errors';
        RAISE NOTICE '    2. Clear browser cache and reload';
        RAISE NOTICE '    3. Check Vercel logs for any errors';
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '⚠️  No AI analyses found yet';
        RAISE NOTICE '';
        RAISE NOTICE 'ℹ️  This is normal if you haven''t run any analyses yet.';
        RAISE NOTICE '   Try running an AI Analysis on a feedback request with ≥3 responses.';
        RAISE NOTICE '';
    END IF;
END $$;

\echo '========================================='
\echo '✅ Diagnostic check complete!'
\echo '========================================='
