-- Add recommendations column to ai_analysis table for AI Coach mode
ALTER TABLE ai_analysis
ADD COLUMN IF NOT EXISTS recommendations JSONB;

-- Add helpful comment
COMMENT ON COLUMN ai_analysis.recommendations IS 'JSON object with actionable recommendations, quick wins, and red flags from AI Coach mode';
