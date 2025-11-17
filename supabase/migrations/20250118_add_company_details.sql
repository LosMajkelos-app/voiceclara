-- Add company/business details to organizations table
-- For corporate registrations with billing/invoicing requirements

-- Add company information columns
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business')),
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT, -- NIP (Poland), VAT number (EU), EIN (US), etc.
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS company_city TEXT,
ADD COLUMN IF NOT EXISTS company_postal_code TEXT,
ADD COLUMN IF NOT EXISTS company_country TEXT DEFAULT 'Poland',
ADD COLUMN IF NOT EXISTS company_phone TEXT,
ADD COLUMN IF NOT EXISTS billing_email TEXT,
ADD COLUMN IF NOT EXISTS billing_name TEXT, -- Contact person for billing
ADD COLUMN IF NOT EXISTS billing_phone TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('credit_card', 'bank_transfer', 'invoice')),
ADD COLUMN IF NOT EXISTS invoice_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS invoice_frequency TEXT CHECK (invoice_frequency IN ('monthly', 'quarterly', 'annually')),
ADD COLUMN IF NOT EXISTS company_website TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+'));

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_organizations_account_type ON organizations(account_type);
CREATE INDEX IF NOT EXISTS idx_organizations_tax_id ON organizations(tax_id) WHERE tax_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_organizations_company_country ON organizations(company_country);

-- Add helpful comments
COMMENT ON COLUMN organizations.account_type IS 'Type of account: personal (individual) or business (company)';
COMMENT ON COLUMN organizations.tax_id IS 'Tax identification number: NIP (Poland), VAT (EU), EIN (US), etc.';
COMMENT ON COLUMN organizations.company_address IS 'Full street address of company headquarters';
COMMENT ON COLUMN organizations.company_city IS 'City where company is registered';
COMMENT ON COLUMN organizations.company_postal_code IS 'Postal/ZIP code';
COMMENT ON COLUMN organizations.company_country IS 'Country of company registration';
COMMENT ON COLUMN organizations.billing_email IS 'Email address for invoices and billing notifications';
COMMENT ON COLUMN organizations.billing_name IS 'Contact person responsible for billing';
COMMENT ON COLUMN organizations.payment_method IS 'Preferred payment method';
COMMENT ON COLUMN organizations.invoice_required IS 'Whether company requires formal invoices';
COMMENT ON COLUMN organizations.invoice_frequency IS 'How often invoices should be generated';
COMMENT ON COLUMN organizations.company_website IS 'Company website URL';
COMMENT ON COLUMN organizations.industry IS 'Industry/sector (e.g., Technology, Healthcare, Finance)';
COMMENT ON COLUMN organizations.company_size IS 'Number of employees';

-- Create invoices table for business accounts
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PLN',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_date DATE,
  notes TEXT,
  pdf_url TEXT, -- S3/storage URL for PDF invoice
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create invoice line items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable RLS on invoices tables
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
-- Only organization owners/admins can view invoices
CREATE POLICY "Organization owners can view invoices"
  ON invoices
  FOR SELECT
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- System can create/update invoices (via API)
CREATE POLICY "System can manage invoices"
  ON invoices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Invoice items inherit invoice permissions
CREATE POLICY "Users can view invoice items"
  ON invoice_items
  FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM invoices
      WHERE organization_id IN (
        SELECT id FROM organizations WHERE owner_id = auth.uid()
        UNION
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )
    )
  );

-- System can manage invoice items
CREATE POLICY "System can manage invoice items"
  ON invoice_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add helpful comments on tables
COMMENT ON TABLE invoices IS 'Invoices generated for business accounts';
COMMENT ON TABLE invoice_items IS 'Line items within each invoice';
COMMENT ON COLUMN invoices.invoice_number IS 'Unique invoice identifier (e.g., INV-2025-001)';
COMMENT ON COLUMN invoices.status IS 'Invoice status: draft, sent, paid, overdue, or cancelled';
COMMENT ON COLUMN invoices.period_start IS 'Start of billing period';
COMMENT ON COLUMN invoices.period_end IS 'End of billing period';
COMMENT ON COLUMN invoices.currency IS 'Currency code (PLN, EUR, USD, etc.)';

-- Function to generate next invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  year_str TEXT;
BEGIN
  year_str := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '\d+$') AS INTEGER)), 0) + 1
  INTO next_num
  FROM invoices
  WHERE organization_id = org_id
    AND invoice_number LIKE 'INV-' || year_str || '-%';

  RETURN 'INV-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_invoice_number IS 'Generates sequential invoice numbers per organization per year (e.g., INV-2025-0001)';
