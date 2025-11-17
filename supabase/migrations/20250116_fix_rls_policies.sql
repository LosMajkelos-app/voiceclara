-- Fix insecure RLS policies identified in security audit
-- This migration replaces overly permissive policies (WITH CHECK (true) / USING (true))
-- with properly restricted policies

-- ==================================================
-- 1. Fix ai_analysis table policies
-- ==================================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "System can insert AI analysis" ON ai_analysis;
DROP POLICY IF EXISTS "System can update AI analysis" ON ai_analysis;

-- Create secure policies: Only API can insert/update, but must validate ownership
CREATE POLICY "API can insert AI analysis for valid requests"
  ON ai_analysis
  FOR INSERT
  WITH CHECK (
    -- Only allow insertion if feedback_request belongs to authenticated user
    -- OR if it's a server-side operation (we'll use RPC functions for this)
    feedback_request_id IN (
      SELECT id FROM feedback_requests WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "API can update AI analysis for valid requests"
  ON ai_analysis
  FOR UPDATE
  USING (
    feedback_request_id IN (
      SELECT id FROM feedback_requests WHERE user_id = auth.uid()
    )
  );

-- ==================================================
-- 2. Fix email_invitations table policies (newer migration)
-- ==================================================

-- Drop overly permissive policies from 20250114 migration
DROP POLICY IF EXISTS "System can insert invitations" ON email_invitations;
DROP POLICY IF EXISTS "System can update invitation status" ON email_invitations;

-- Create secure policies: Users can only manage invitations for their own requests
CREATE POLICY "Users can insert invitations for their requests"
  ON email_invitations
  FOR INSERT
  WITH CHECK (
    feedback_request_id IN (
      SELECT id FROM feedback_requests WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invitations for their requests"
  ON email_invitations
  FOR UPDATE
  USING (
    feedback_request_id IN (
      SELECT id FROM feedback_requests WHERE user_id = auth.uid()
    )
  );

-- ==================================================
-- 3. Fix organization_invitations table policies
-- ==================================================

-- Drop overly permissive update policy
DROP POLICY IF EXISTS "System can update invitation status" ON organization_invitations;

-- Create secure policy: Only invitation recipient or org admins can update
CREATE POLICY "Recipients and admins can update invitations"
  ON organization_invitations
  FOR UPDATE
  USING (
    -- Recipient can accept/decline their own invitation
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    -- Org admins can update invitations
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ==================================================
-- 4. Fix feedback_requests policies - allow guest linking
-- ==================================================

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their feedback requests" ON feedback_requests;

-- Recreate with support for guest request linking
CREATE POLICY "Users can update their feedback requests"
  ON feedback_requests
  FOR UPDATE
  USING (
    -- User owns the request
    user_id = auth.uid()
    OR
    -- Guest request linking: user can claim requests created with their email
    (user_id IS NULL AND guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR
    -- Org admins can update org requests
    (
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )
    )
  );

-- ==================================================
-- 5. Add helpful comments
-- ==================================================

COMMENT ON POLICY "API can insert AI analysis for valid requests" ON ai_analysis
  IS 'Restricts AI analysis insertion to requests owned by the authenticated user';

COMMENT ON POLICY "Users can update their feedback requests" ON feedback_requests
  IS 'Allows users to update their own requests, claim guest requests, and org admins to manage org requests';

COMMENT ON POLICY "Recipients and admins can update invitations" ON organization_invitations
  IS 'Only invitation recipients (to accept/decline) or org admins can update invitations';
