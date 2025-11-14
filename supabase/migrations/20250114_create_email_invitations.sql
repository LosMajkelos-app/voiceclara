-- Create email_invitations table for tracking who was invited to provide feedback
CREATE TABLE IF NOT EXISTS email_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_request_id UUID NOT NULL REFERENCES feedback_requests(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'opened', 'responded'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Indexes for performance
  CONSTRAINT email_invitations_feedback_request_id_fkey FOREIGN KEY (feedback_request_id) REFERENCES feedback_requests(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_invitations_feedback_request_id ON email_invitations(feedback_request_id);
CREATE INDEX IF NOT EXISTS idx_email_invitations_sent_at ON email_invitations(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_invitations_recipient_email ON email_invitations(recipient_email);

-- Enable RLS (Row Level Security)
ALTER TABLE email_invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view invitations for their own feedback requests
CREATE POLICY "Users can view invitations for their requests"
  ON email_invitations
  FOR SELECT
  USING (
    feedback_request_id IN (
      SELECT id FROM feedback_requests WHERE user_id = auth.uid()
    )
  );

-- Policy: System can insert invitations (API endpoint)
CREATE POLICY "System can insert invitations"
  ON email_invitations
  FOR INSERT
  WITH CHECK (true);

-- Policy: System can update invitation status (for tracking opens)
CREATE POLICY "System can update invitation status"
  ON email_invitations
  FOR UPDATE
  USING (true);

-- Add helpful comment
COMMENT ON TABLE email_invitations IS 'Tracks email invitations sent for feedback requests';
COMMENT ON COLUMN email_invitations.status IS 'sent, opened, or responded';
