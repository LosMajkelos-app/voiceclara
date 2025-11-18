-- Add response_count_at_analysis column if it doesn't exist
-- This column tracks how many responses were analyzed in the last AI analysis

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'ai_analysis'
    AND column_name = 'response_count_at_analysis'
  ) THEN
    ALTER TABLE ai_analysis
    ADD COLUMN response_count_at_analysis INTEGER DEFAULT 0;

    RAISE NOTICE 'Column response_count_at_analysis added to ai_analysis table';
  ELSE
    RAISE NOTICE 'Column response_count_at_analysis already exists in ai_analysis table';
  END IF;
END $$;

-- Add comment
COMMENT ON COLUMN ai_analysis.response_count_at_analysis
IS 'Number of responses that were analyzed when this AI analysis was created';
