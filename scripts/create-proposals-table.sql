-- Creating proposals table to fix database error
CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  contact_id INTEGER REFERENCES contacts(id),
  service_id INTEGER,
  template_id INTEGER,
  total_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'draft',
  expires_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  signed_at TIMESTAMP,
  signed_by VARCHAR(255)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_contact_id ON proposals(contact_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);
