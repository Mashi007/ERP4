-- Execute the contacts configuration script
-- This will create the necessary tables for contact field configuration

-- First, check if tables already exist and drop them if needed for a clean setup
DROP TABLE IF EXISTS contact_field_configs CASCADE;
DROP TABLE IF EXISTS contact_field_groups CASCADE;

-- Create contact field groups table
CREATE TABLE contact_field_groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) UNIQUE NOT NULL,
    group_label VARCHAR(200) NOT NULL,
    group_description TEXT,
    group_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_collapsible BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact field configurations table
CREATE TABLE contact_field_configs (
    id SERIAL PRIMARY KEY,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL DEFAULT 'text',
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    field_order INTEGER DEFAULT 1,
    field_group VARCHAR(100) DEFAULT 'general',
    help_text TEXT,
    default_value TEXT,
    validation_rules JSONB DEFAULT '{}',
    field_options JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_group) REFERENCES contact_field_groups(group_name) ON UPDATE CASCADE
);

-- Insert default groups
INSERT INTO contact_field_groups (group_name, group_label, group_description, group_order, is_collapsible) VALUES
('general', 'Información General', 'Datos básicos del contacto', 1, false),
('contact_info', 'Información de Contacto', 'Medios de comunicación', 2, false),
('business', 'Información Empresarial', 'Información relacionada con la empresa', 3, false),
('custom', 'Campos Personalizados', 'Campos adicionales definidos por el usuario', 4, true);

-- Insert default fields
INSERT INTO contact_field_configs (field_name, field_label, field_type, is_required, field_group, help_text, field_order) VALUES
('name', 'Nombre', 'text', true, 'general', 'Nombre completo del contacto', 1),
('email', 'Email', 'email', false, 'contact_info', 'Correo electrónico del contacto', 1),
('phone', 'Teléfono', 'phone', false, 'contact_info', 'Número de teléfono del contacto', 2),
('company', 'Empresa', 'text', false, 'business', 'Nombre de la empresa', 1),
('job_title', 'Cargo', 'text', false, 'business', 'Título del puesto', 2);

-- Create indexes for better performance
CREATE INDEX idx_contact_field_configs_group ON contact_field_configs(field_group);
CREATE INDEX idx_contact_field_configs_active ON contact_field_configs(is_active);
CREATE INDEX idx_contact_field_configs_order ON contact_field_configs(field_group, field_order);
CREATE INDEX idx_contact_field_groups_order ON contact_field_groups(group_order);

-- Add some sample custom fields to demonstrate functionality
INSERT INTO contact_field_configs (field_name, field_label, field_type, is_required, field_group, help_text, field_order, field_options) VALUES
('industry', 'Industria', 'select', false, 'business', 'Sector de la empresa', 3, '[
    {"value": "technology", "label": "Tecnología"},
    {"value": "healthcare", "label": "Salud"},
    {"value": "finance", "label": "Finanzas"},
    {"value": "education", "label": "Educación"},
    {"value": "retail", "label": "Retail"},
    {"value": "manufacturing", "label": "Manufactura"},
    {"value": "other", "label": "Otro"}
]'),
('website', 'Sitio Web', 'url', false, 'business', 'URL del sitio web de la empresa', 4),
('notes', 'Notas', 'textarea', false, 'custom', 'Notas adicionales sobre el contacto', 1),
('lead_source', 'Fuente del Lead', 'select', false, 'custom', 'Cómo conoció a este contacto', 2, '[
    {"value": "website", "label": "Sitio Web"},
    {"value": "referral", "label": "Referido"},
    {"value": "social_media", "label": "Redes Sociales"},
    {"value": "email_marketing", "label": "Email Marketing"},
    {"value": "cold_call", "label": "Llamada Fría"},
    {"value": "event", "label": "Evento"},
    {"value": "other", "label": "Otro"}
]');

-- Update the updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_contact_field_groups_updated_at 
    BEFORE UPDATE ON contact_field_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_field_configs_updated_at 
    BEFORE UPDATE ON contact_field_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'Contact field groups created:' as status, count(*) as count FROM contact_field_groups;
SELECT 'Contact field configs created:' as status, count(*) as count FROM contact_field_configs;

-- Show the created structure
SELECT 
    cg.group_label,
    cg.group_order,
    cf.field_label,
    cf.field_type,
    cf.is_required,
    cf.is_active
FROM contact_field_groups cg
LEFT JOIN contact_field_configs cf ON cg.group_name = cf.field_group
ORDER BY cg.group_order, cf.field_order;
