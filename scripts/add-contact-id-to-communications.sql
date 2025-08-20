-- Add contact_id column to communications table
ALTER TABLE communications 
ADD COLUMN contact_id INTEGER;

-- Add index for better performance on contact_id lookups
CREATE INDEX idx_communications_contact_id ON communications(contact_id);

-- Add foreign key constraint to ensure data integrity
ALTER TABLE communications 
ADD CONSTRAINT fk_communications_contact_id 
FOREIGN KEY (contact_id) REFERENCES contacts(id);
