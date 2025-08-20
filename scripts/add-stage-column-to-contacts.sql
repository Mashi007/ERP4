-- Add stage column to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT 'Nuevo';

-- Update existing contacts to have a default stage
UPDATE contacts SET stage = 'Nuevo' WHERE stage IS NULL;

-- Add comment to the column
COMMENT ON COLUMN contacts.stage IS 'Sales funnel stage for the contact';
