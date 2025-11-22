-- ============================================
-- FIX: Ensure recommendations column exists
-- ============================================
-- This migration ensures the recommendations column exists in ai_analysis table
-- Run this in Supabase Dashboard SQL Editor if AI Coach data is not saving

-- Step 1: Check if column exists and add it if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ai_analysis'
        AND column_name = 'recommendations'
    ) THEN
        ALTER TABLE ai_analysis ADD COLUMN recommendations JSONB;
        RAISE NOTICE 'Column recommendations added to ai_analysis table';
    ELSE
        RAISE NOTICE 'Column recommendations already exists in ai_analysis table';
    END IF;
END $$;

-- Step 2: Add helpful comment
COMMENT ON COLUMN ai_analysis.recommendations IS 'JSON object with actionable recommendations, quick wins, and red flags from AI Coach mode';

-- Step 3: Verify the column exists
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'ai_analysis'
AND column_name = 'recommendations';

-- Step 4: Show sample data to verify
SELECT
    id,
    feedback_request_id,
    recommendations IS NOT NULL as has_recommendations,
    recommendations -> 'actionItems' as action_items,
    recommendations -> 'quickWins' as quick_wins,
    recommendations -> 'redFlags' as red_flags,
    analyzed_at
FROM ai_analysis
ORDER BY analyzed_at DESC
LIMIT 5;
