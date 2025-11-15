-- Create ai_analysis table for storing AI-generated insights
CREATE TABLE IF NOT EXISTS ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_request_id UUID NOT NULL UNIQUE REFERENCES feedback_requests(id) ON DELETE CASCADE,
  themes JSONB,
  sentiment JSONB,
  summary JSONB,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response_count_at_analysis INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ai_analysis_feedback_request_id ON ai_analysis(feedback_request_id);

-- Enable RLS (Row Level Security)
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view AI analysis for their own feedback requests
CREATE POLICY "Users can view AI analysis for their requests"
  ON ai_analysis
  FOR SELECT
  USING (
    feedback_request_id IN (
      SELECT id FROM feedback_requests WHERE user_id = auth.uid()
    )
  );

-- Policy: System can insert AI analysis (API endpoint)
CREATE POLICY "System can insert AI analysis"
  ON ai_analysis
  FOR INSERT
  WITH CHECK (true);

-- Policy: System can update AI analysis (for re-analysis)
CREATE POLICY "System can update AI analysis"
  ON ai_analysis
  FOR UPDATE
  USING (true);

-- Add helpful comment
COMMENT ON TABLE ai_analysis IS 'Stores AI-generated analysis of feedback responses';
COMMENT ON COLUMN ai_analysis.themes IS 'JSON array of identified themes';
COMMENT ON COLUMN ai_analysis.sentiment IS 'JSON object with sentiment analysis results';
COMMENT ON COLUMN ai_analysis.summary IS 'JSON object with summary, strengths, growth areas, and recommendations';
