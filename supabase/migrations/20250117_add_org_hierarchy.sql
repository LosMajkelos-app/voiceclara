-- Add organizational hierarchy support to organization_members
-- This enables multi-level management structures (Admin -> Manager -> Employee)

-- Add hierarchy columns to organization_members
ALTER TABLE organization_members
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES organization_members(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 0; -- 0 = owner/admin, 1 = manager, 2 = employee, etc.

-- Create index for manager relationships
CREATE INDEX IF NOT EXISTS idx_organization_members_manager_id ON organization_members(manager_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_department ON organization_members(department);

-- Add helpful comments
COMMENT ON COLUMN organization_members.manager_id IS 'References the member who manages this member (creates hierarchy)';
COMMENT ON COLUMN organization_members.department IS 'Department name (e.g., Engineering, Sales, Marketing)';
COMMENT ON COLUMN organization_members.job_title IS 'Job title (e.g., Senior Engineer, Account Manager)';
COMMENT ON COLUMN organization_members.level IS 'Hierarchy level: 0=owner/admin, 1=manager, 2=employee, 3+=junior';

-- Function to get all subordinates (direct and indirect) for a manager
CREATE OR REPLACE FUNCTION get_subordinates(member_id UUID)
RETURNS TABLE (
  subordinate_id UUID,
  subordinate_user_id UUID,
  subordinate_role TEXT,
  subordinate_department TEXT,
  subordinate_level INTEGER,
  depth INTEGER
) AS $$
WITH RECURSIVE subordinate_tree AS (
  -- Base case: direct reports
  SELECT
    id as subordinate_id,
    user_id as subordinate_user_id,
    role as subordinate_role,
    department as subordinate_department,
    level as subordinate_level,
    1 as depth
  FROM organization_members
  WHERE manager_id = member_id

  UNION ALL

  -- Recursive case: reports of reports
  SELECT
    om.id,
    om.user_id,
    om.role,
    om.department,
    om.level,
    st.depth + 1
  FROM organization_members om
  INNER JOIN subordinate_tree st ON om.manager_id = st.subordinate_id
  WHERE st.depth < 10 -- Prevent infinite loops
)
SELECT * FROM subordinate_tree;
$$ LANGUAGE SQL STABLE;

-- Function to check if user A manages user B (directly or indirectly)
CREATE OR REPLACE FUNCTION is_manager_of(manager_member_id UUID, employee_member_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM get_subordinates(manager_member_id)
    WHERE subordinate_id = employee_member_id
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Update RLS policy for feedback_requests to respect hierarchy
-- Managers can view their subordinates' feedback requests
DROP POLICY IF EXISTS "Users can view their feedback requests" ON feedback_requests;

CREATE POLICY "Users can view their feedback requests"
  ON feedback_requests
  FOR SELECT
  USING (
    -- Owner of the request
    user_id = auth.uid()
    OR
    -- Guest can view via guest_email
    guest_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    -- Organization members can view org requests based on hierarchy
    (
      organization_id IN (
        SELECT om.organization_id FROM organization_members om WHERE om.user_id = auth.uid()
      )
      AND (
        -- Admins/Owners see all org requests
        EXISTS (
          SELECT 1 FROM organization_members om
          WHERE om.user_id = auth.uid()
            AND om.organization_id = feedback_requests.organization_id
            AND om.role IN ('owner', 'admin')
        )
        OR
        -- Managers see their subordinates' requests
        EXISTS (
          SELECT 1 FROM organization_members manager_om
          WHERE manager_om.user_id = auth.uid()
            AND manager_om.organization_id = feedback_requests.organization_id
            AND manager_om.role = 'manager'
            AND (
              -- Direct report
              feedback_requests.user_id IN (
                SELECT user_id FROM organization_members
                WHERE manager_id = manager_om.id
              )
              OR
              -- Indirect report (recursive)
              feedback_requests.user_id IN (
                SELECT subordinate_user_id FROM get_subordinates(manager_om.id)
              )
            )
        )
      )
    )
  );

-- Add constraint to prevent circular management relationships
-- A manager cannot be their own subordinate
CREATE OR REPLACE FUNCTION check_no_circular_management()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent self-management
  IF NEW.manager_id = NEW.id THEN
    RAISE EXCEPTION 'A member cannot be their own manager';
  END IF;

  -- Prevent circular relationships (A manages B, B manages A)
  IF EXISTS (
    WITH RECURSIVE manager_chain AS (
      SELECT manager_id, id, 1 as depth
      FROM organization_members
      WHERE id = NEW.manager_id

      UNION ALL

      SELECT om.manager_id, om.id, mc.depth + 1
      FROM organization_members om
      INNER JOIN manager_chain mc ON om.id = mc.manager_id
      WHERE mc.depth < 10
    )
    SELECT 1 FROM manager_chain WHERE manager_id = NEW.id
  ) THEN
    RAISE EXCEPTION 'Circular management relationship detected';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce no circular management
DROP TRIGGER IF EXISTS enforce_no_circular_management ON organization_members;
CREATE TRIGGER enforce_no_circular_management
  BEFORE INSERT OR UPDATE OF manager_id ON organization_members
  FOR EACH ROW
  EXECUTE FUNCTION check_no_circular_management();

-- Add helpful view for organization chart
CREATE OR REPLACE VIEW organization_hierarchy AS
SELECT
  om.id,
  om.organization_id,
  om.user_id,
  om.role,
  om.manager_id,
  om.department,
  om.job_title,
  om.level,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  manager_om.user_id as manager_user_id,
  manager_u.email as manager_email,
  manager_u.raw_user_meta_data->>'full_name' as manager_name
FROM organization_members om
LEFT JOIN auth.users u ON om.user_id = u.id
LEFT JOIN organization_members manager_om ON om.manager_id = manager_om.id
LEFT JOIN auth.users manager_u ON manager_om.user_id = manager_u.id;

COMMENT ON VIEW organization_hierarchy IS 'View showing organizational hierarchy with user and manager details';
