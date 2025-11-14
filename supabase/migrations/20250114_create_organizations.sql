-- Create organizations table (workspaces/teams)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'business'
  settings JSONB DEFAULT '{}'::jsonb, -- Organization settings
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create organization_members table (team membership with roles)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),

  -- Ensure unique membership per user per organization
  UNIQUE(organization_id, user_id)
);

-- Create organization_invitations table (pending team invites)
CREATE TABLE IF NOT EXISTS organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate pending invitations
  UNIQUE(organization_id, email, status)
);

-- Add organization_id to feedback_requests (nullable for backward compatibility)
ALTER TABLE feedback_requests
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_invitations_org_id ON organization_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_invitations_email ON organization_invitations(email);
CREATE INDEX IF NOT EXISTS idx_organization_invitations_token ON organization_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_feedback_requests_org_id ON feedback_requests(organization_id);

-- Enable RLS on all organization tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
-- Users can view organizations they own or are members of
CREATE POLICY "Users can view their organizations"
  ON organizations
  FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Only owners can update their organizations
CREATE POLICY "Owners can update their organizations"
  ON organizations
  FOR UPDATE
  USING (owner_id = auth.uid());

-- Only owners can delete their organizations
CREATE POLICY "Owners can delete their organizations"
  ON organizations
  FOR DELETE
  USING (owner_id = auth.uid());

-- Users can create organizations
CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- RLS Policies for organization_members
-- Users can view members of their organizations
CREATE POLICY "Users can view members of their organizations"
  ON organization_members
  FOR SELECT
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Admins and owners can add members
CREATE POLICY "Admins can add members"
  ON organization_members
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Admins and owners can update member roles
CREATE POLICY "Admins can update members"
  ON organization_members
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Admins, owners, and the member themselves can remove membership
CREATE POLICY "Admins can remove members"
  ON organization_members
  FOR DELETE
  USING (
    user_id = auth.uid() -- Members can remove themselves
    OR organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for organization_invitations
-- Users can view invitations for their organizations
CREATE POLICY "Users can view invitations for their organizations"
  ON organization_invitations
  FOR SELECT
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admins can create invitations
CREATE POLICY "Admins can create invitations"
  ON organization_invitations
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- System can update invitation status (for accepting invites)
CREATE POLICY "System can update invitation status"
  ON organization_invitations
  FOR UPDATE
  USING (true);

-- Admins can delete invitations
CREATE POLICY "Admins can delete invitations"
  ON organization_invitations
  FOR DELETE
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Update feedback_requests RLS to include organization access
ALTER TABLE feedback_requests ENABLE ROW LEVEL SECURITY;

-- Users can view feedback requests they created or their organization's requests
CREATE POLICY "Users can view their feedback requests"
  ON feedback_requests
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Users can create feedback requests
CREATE POLICY "Users can create feedback requests"
  ON feedback_requests
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IS NULL -- Allow guest creation
  );

-- Users can update their own requests, or org admins can update org requests
CREATE POLICY "Users can update their feedback requests"
  ON feedback_requests
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR (
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )
    )
  );

-- Users can delete their own requests, or org admins can delete org requests
CREATE POLICY "Users can delete their feedback requests"
  ON feedback_requests
  FOR DELETE
  USING (
    user_id = auth.uid()
    OR (
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )
    )
  );

-- Helpful comments
COMMENT ON TABLE organizations IS 'Organizations (workspaces/teams) for team collaboration';
COMMENT ON TABLE organization_members IS 'Team membership with role-based access control';
COMMENT ON TABLE organization_invitations IS 'Pending invitations to join organizations';
COMMENT ON COLUMN organizations.plan_type IS 'free, pro, or business subscription tier';
COMMENT ON COLUMN organization_members.role IS 'owner, admin, member, or viewer';
COMMENT ON COLUMN organization_invitations.status IS 'pending, accepted, or expired';

-- Function to automatically create personal organization on user signup
CREATE OR REPLACE FUNCTION create_personal_organization()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Create personal organization for new user
  INSERT INTO organizations (name, slug, owner_id, plan_type)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Workspace'),
    'personal-' || NEW.id::text,
    NEW.id,
    'free'
  )
  RETURNING id INTO org_id;

  -- Add user as owner member
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create personal organization on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_personal_organization();
