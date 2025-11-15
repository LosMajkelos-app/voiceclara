-- Enable Row Level Security on responses table
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can submit feedback responses" ON responses;
DROP POLICY IF EXISTS "Users can view responses to their requests" ON responses;
DROP POLICY IF EXISTS "No updates on responses" ON responses;
DROP POLICY IF EXISTS "No deletes on responses" ON responses;

-- Policy 1: Anyone can insert responses (anonymous feedback is allowed)
-- This is intentional - we want people to submit feedback without logging in
CREATE POLICY "Anyone can submit feedback responses"
  ON responses
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Users can view responses to their own feedback requests
-- Only the creator of a feedback request can see the responses
CREATE POLICY "Users can view responses to their requests"
  ON responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = responses.feedback_request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Policy 3: No one can update responses (responses are immutable)
CREATE POLICY "No updates on responses"
  ON responses
  FOR UPDATE
  USING (false);

-- Policy 4: Only request owners can delete responses (for moderation)
CREATE POLICY "Request owners can delete responses"
  ON responses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = responses.feedback_request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Add comment for documentation
COMMENT ON TABLE responses IS 'Responses to feedback requests. RLS enabled: users can only view responses to their own requests, but anyone can submit responses (anonymous feedback).';
