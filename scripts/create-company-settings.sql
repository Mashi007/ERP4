-- Create company_settings table for storing company information
CREATE TABLE IF NOT EXISTS company_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  tax_id VARCHAR(100),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'México',
  description TEXT,
  logo_url TEXT,
  facebook VARCHAR(255),
  twitter VARCHAR(255),
  linkedin VARCHAR(255),
  instagram VARCHAR(255),
  youtube VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default company data
INSERT INTO company_settings (
  name, email, country, created_at, updated_at
) VALUES (
  'NormaPymes', 'contacto@normapymes.com', 'México', NOW(), NOW()
) ON CONFLICT DO NOTHING;
