-- Create email_invitations table to track sent invitations
CREATE TABLE IF NOT EXISTS email_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_request_id UUID NOT NULL REFERENCES feedback_requests(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'bounced', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_invitations_request_id ON email_invitations(feedback_request_id);
CREATE INDEX IF NOT EXISTS idx_email_invitations_email ON email_invitations(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_invitations_status ON email_invitations(status);

-- Enable Row Level Security
ALTER TABLE email_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view invitations for their own feedback requests
CREATE POLICY "Users can view own invitations"
  ON email_invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = email_invitations.feedback_request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Users can insert invitations for their own feedback requests
CREATE POLICY "Users can create own invitations"
  ON email_invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = email_invitations.feedback_request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Users can update invitations for their own feedback requests
CREATE POLICY "Users can update own invitations"
  ON email_invitations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = email_invitations.feedback_request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Add notification preferences to users (if you want to allow users to opt-out)
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"new_responses": true, "reminders": true}'::jsonb;

COMMENT ON TABLE email_invitations IS 'Tracks email invitations sent for feedback requests';
COMMENT ON COLUMN email_invitations.status IS 'Status of the invitation: sent, bounced, failed';
COMMENT ON COLUMN email_invitations.reminder_sent_at IS 'When the reminder email was sent (if any)';
COMMENT ON COLUMN email_invitations.responded_at IS 'When the recipient responded (if tracked)';
