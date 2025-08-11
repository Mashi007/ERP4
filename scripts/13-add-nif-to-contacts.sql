-- Adds a NIF column to contacts table. Safe to run multiple times.
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS nif TEXT;

-- Optional: if you want to index or enforce uniqueness, uncomment as needed:
-- CREATE UNIQUE INDEX IF NOT EXISTS contacts_nif_unique_idx ON contacts (nif);
