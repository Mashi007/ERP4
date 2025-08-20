-- Add missing filter columns to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS industry VARCHAR(255),
ADD COLUMN IF NOT EXISTS source VARCHAR(255);

-- Set default values for existing records
UPDATE contacts 
SET industry = 'General' 
WHERE industry IS NULL;

UPDATE contacts 
SET source = 'Direct' 
WHERE source IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_industry ON contacts(industry);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
