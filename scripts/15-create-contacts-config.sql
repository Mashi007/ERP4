-- Create contact field groups table
CREATE TABLE IF NOT EXISTS contact_field_groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) UNIQUE NOT NULL,
    group_label VARCHAR(200) NOT NULL,
    group_description TEXT,
    group_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_collapsible BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact fields table
CREATE TABLE IF NOT EXISTS contact_fields (
    id SERIAL PRIMARY KEY,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'number', 'select', 'date', 'boolean', 'textarea', 'url')),
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    field_order INTEGER DEFAULT 0,
    default_value TEXT,
    validation_rules JSONB DEFAULT '{}',
    field_options JSONB DEFAULT '[]',
    help_text TEXT,
    field_group VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_group) REFERENCES contact_field_groups(group_name) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_fields_group ON contact_fields(field_group);
CREATE INDEX IF NOT EXISTS idx_contact_fields_active ON contact_fields(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_fields_order ON contact_fields(field_order);
CREATE INDEX IF NOT EXISTS idx_contact_field_groups_active ON contact_field_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_field_groups_order ON contact_field_groups(group_order);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_fields_updated_at BEFORE UPDATE ON contact_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_field_groups_updated_at BEFORE UPDATE ON contact_field_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default groups
INSERT INTO contact_field_groups (group_name, group_label, group_description, group_order, is_active, is_collapsible) VALUES
('general', 'Información General', 'Datos básicos del contacto', 1, true, false),
('contact_info', 'Información de Contacto', 'Medios de comunicación', 2, true, false),
('business', 'Información Empresarial', 'Datos de la empresa', 3, true, true),
('personal', 'Información Personal', 'Datos personales adicionales', 4, true, true),
('preferences', 'Preferencias', 'Configuraciones y preferencias del contacto', 5, true, true)
ON CONFLICT (group_name) DO NOTHING;

-- Insert default fields
INSERT INTO contact_fields (field_name, field_label, field_type, is_required, is_active, field_order, help_text, field_group, validation_rules, field_options) VALUES
('name', 'Nombre', 'text', true, true, 1, 'Nombre completo del contacto', 'general', '{"minLength": 2, "maxLength": 100}', '[]'),
('email', 'Email', 'email', true, true, 2, 'Dirección de correo electrónico', 'contact_info', '{"pattern": "^[^@]+@[^@]+\\.[^@]+$"}', '[]'),
('phone', 'Teléfono', 'phone', false, true, 3, 'Número de teléfono principal', 'contact_info', '{"pattern": "^[+]?[0-9\\s\\-\$$\$$]+$"}', '[]'),
('mobile', 'Móvil', 'phone', false, true, 4, 'Número de teléfono móvil', 'contact_info', '{"pattern": "^[+]?[0-9\\s\\-\$$\$$]+$"}', '[]'),
('company', 'Empresa', 'text', false, true, 5, 'Nombre de la empresa', 'business', '{"maxLength": 200}', '[]'),
('position', 'Cargo', 'text', false, true, 6, 'Posición en la empresa', 'business', '{"maxLength": 100}', '[]'),
('website', 'Sitio Web', 'url', false, true, 7, 'Sitio web de la empresa', 'business', '{"pattern": "^https?://.*"}', '[]'),
('industry', 'Industria', 'select', false, true, 8, 'Sector de la empresa', 'business', '{}', '[
    {"value": "technology", "label": "Tecnología"},
    {"value": "healthcare", "label": "Salud"},
    {"value": "finance", "label": "Finanzas"},
    {"value": "education", "label": "Educación"},
    {"value": "retail", "label": "Retail"},
    {"value": "manufacturing", "label": "Manufactura"},
    {"value": "consulting", "label": "Consultoría"},
    {"value": "real_estate", "label": "Bienes Raíces"},
    {"value": "other", "label": "Otro"}
]'),
('lead_source', 'Fuente del Lead', 'select', false, true, 9, 'Cómo conoció sobre nosotros', 'general', '{}', '[
    {"value": "website", "label": "Sitio Web"},
    {"value": "referral", "label": "Referencia"},
    {"value": "social_media", "label": "Redes Sociales"},
    {"value": "advertising", "label": "Publicidad"},
    {"value": "event", "label": "Evento"},
    {"value": "cold_call", "label": "Llamada en Frío"},
    {"value": "email_campaign", "label": "Campaña de Email"},
    {"value": "other", "label": "Otro"}
]'),
('birthday', 'Fecha de Nacimiento', 'date', false, false, 10, 'Fecha de nacimiento del contacto', 'personal', '{}', '[]'),
('address', 'Dirección', 'textarea', false, true, 11, 'Dirección completa', 'contact_info', '{"maxLength": 500}', '[]'),
('notes', 'Notas', 'textarea', false, true, 12, 'Notas adicionales sobre el contacto', 'general', '{"maxLength": 1000}', '[]'),
('preferred_contact', 'Método de Contacto Preferido', 'select', false, true, 13, 'Forma preferida de comunicación', 'preferences', '{}', '[
    {"value": "email", "label": "Email"},
    {"value": "phone", "label": "Teléfono"},
    {"value": "whatsapp", "label": "WhatsApp"},
    {"value": "sms", "label": "SMS"}
]'),
('newsletter_subscription', 'Suscripción a Newsletter', 'boolean', false, true, 14, 'Acepta recibir newsletter', 'preferences', '{}', '[]'),
('tags', 'Etiquetas', 'text', false, true, 15, 'Etiquetas separadas por comas', 'general', '{"maxLength": 200}', '[]')
ON CONFLICT (field_name, field_group) DO NOTHING;

-- Update field orders to ensure proper sequencing
UPDATE contact_fields SET field_order = 
    CASE field_name
        WHEN 'name' THEN 1
        WHEN 'email' THEN 2
        WHEN 'phone' THEN 3
        WHEN 'mobile' THEN 4
        WHEN 'company' THEN 5
        WHEN 'position' THEN 6
        WHEN 'website' THEN 7
        WHEN 'industry' THEN 8
        WHEN 'lead_source' THEN 9
        WHEN 'birthday' THEN 10
        WHEN 'address' THEN 11
        WHEN 'notes' THEN 12
        WHEN 'preferred_contact' THEN 13
        WHEN 'newsletter_subscription' THEN 14
        WHEN 'tags' THEN 15
        ELSE field_order
    END;

-- Create a view for easy field retrieval with group information
CREATE OR REPLACE VIEW contact_fields_with_groups AS
SELECT 
    cf.*,
    cfg.group_label,
    cfg.group_description,
    cfg.is_collapsible as group_is_collapsible
FROM contact_fields cf
LEFT JOIN contact_field_groups cfg ON cf.field_group = cfg.group_name
WHERE cf.is_active = true AND cfg.is_active = true
ORDER BY cfg.group_order, cf.field_order;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON contact_fields TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON contact_field_groups TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE contact_fields_id_seq TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE contact_field_groups_id_seq TO your_app_user;

-- Add some sample custom fields for demonstration
INSERT INTO contact_fields (field_name, field_label, field_type, is_required, is_active, field_order, help_text, field_group, validation_rules, field_options) VALUES
('linkedin_profile', 'Perfil de LinkedIn', 'url', false, false, 16, 'URL del perfil de LinkedIn', 'business', '{"pattern": "^https://.*linkedin\\.com/.*"}', '[]'),
('annual_revenue', 'Ingresos Anuales', 'select', false, false, 17, 'Rango de ingresos anuales de la empresa', 'business', '{}', '[
    {"value": "under_1m", "label": "Menos de $1M"},
    {"value": "1m_10m", "label": "$1M - $10M"},
    {"value": "10m_50m", "label": "$10M - $50M"},
    {"value": "50m_100m", "label": "$50M - $100M"},
    {"value": "over_100m", "label": "Más de $100M"}
]'),
('employee_count', 'Número de Empleados', 'select', false, false, 18, 'Tamaño de la empresa', 'business', '{}', '[
    {"value": "1_10", "label": "1-10"},
    {"value": "11_50", "label": "11-50"},
    {"value": "51_200", "label": "51-200"},
    {"value": "201_500", "label": "201-500"},
    {"value": "501_1000", "label": "501-1000"},
    {"value": "over_1000", "label": "Más de 1000"}
]')
ON CONFLICT (field_name, field_group) DO NOTHING;

COMMIT;
