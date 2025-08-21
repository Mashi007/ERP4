-- Create services system tables for AI-powered proposal generation

-- Services table (extends products functionality)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    base_price NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    duration_hours INTEGER,
    features JSONB, -- Array of service features
    requirements JSONB, -- Client requirements for this service
    deliverables JSONB, -- What client receives
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposal templates with AI variable substitution
CREATE TABLE IF NOT EXISTS proposal_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL, -- HTML/Markdown template with variables
    variables JSONB, -- Available variables: {contact}, {service}, {custom}
    category VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated proposals
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    service_id INTEGER REFERENCES services(id),
    template_id INTEGER REFERENCES proposal_templates(id),
    title VARCHAR(255) NOT NULL,
    content TEXT, -- AI-generated content with variables filled
    total_amount NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, accepted, rejected
    pdf_url TEXT, -- Generated PDF file URL
    digital_signature_url TEXT, -- Digital signature document URL
    expires_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service-proposal line items (for multiple services in one proposal)
CREATE TABLE IF NOT EXISTS proposal_line_items (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10,2),
    total_price NUMERIC(10,2),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication log for proposals (WhatsApp/Email tracking)
CREATE TABLE IF NOT EXISTS proposal_communications (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id),
    communication_type VARCHAR(50), -- email, whatsapp, sms
    recipient VARCHAR(255), -- email or phone number
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI generation history for proposals
CREATE TABLE IF NOT EXISTS proposal_ai_generations (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
    prompt_used TEXT,
    ai_model VARCHAR(100),
    generation_time_ms INTEGER,
    tokens_used INTEGER,
    variables_data JSONB, -- The actual data used for variable substitution
    generated_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default proposal template
INSERT INTO proposal_templates (name, description, template_content, variables, category, is_default) VALUES
('Propuesta Estándar', 'Plantilla estándar para propuestas de servicios', 
'# Propuesta de Servicios para {{contact.name}}

## Información del Cliente
- **Empresa:** {{contact.company}}
- **Contacto:** {{contact.name}}
- **Email:** {{contact.email}}
- **Teléfono:** {{contact.phone}}

## Servicio Propuesto
**{{service.name}}**

{{service.description}}

### Características Incluidas:
{{#each service.features}}
- {{this}}
{{/each}}

### Entregables:
{{#each service.deliverables}}
- {{this}}
{{/each}}

## Inversión
- **Precio Base:** {{service.base_price}} {{service.currency}}
- **Duración Estimada:** {{service.duration_hours}} horas

## Términos y Condiciones
Esta propuesta es válida por 30 días desde la fecha de emisión.

---
*Generado automáticamente el {{current_date}}*',
'{"contact": ["name", "company", "email", "phone"], "service": ["name", "description", "features", "deliverables", "base_price", "currency", "duration_hours"], "custom": ["current_date", "proposal_number"]}',
'general', true);

-- Insert sample services
INSERT INTO services (name, description, category, base_price, duration_hours, features, deliverables) VALUES
('Consultoría Digital', 'Análisis y estrategia de transformación digital para empresas', 'Consultoría', 2500.00, 40, 
'["Análisis de procesos actuales", "Estrategia de digitalización", "Plan de implementación", "Seguimiento mensual"]',
'["Informe de diagnóstico", "Estrategia personalizada", "Roadmap de implementación", "3 sesiones de seguimiento"]'),

('Desarrollo Web Corporativo', 'Sitio web profesional con CMS y optimización SEO', 'Desarrollo', 3500.00, 80,
'["Diseño responsive", "CMS personalizado", "Optimización SEO", "Integración con redes sociales"]',
'["Sitio web completo", "Panel de administración", "Manual de uso", "3 meses de soporte"]'),

('Marketing Digital', 'Campaña integral de marketing digital y redes sociales', 'Marketing', 1800.00, 30,
'["Estrategia de contenidos", "Gestión de redes sociales", "Publicidad online", "Análisis de resultados"]',
'["Plan de marketing", "Contenido para 3 meses", "Configuración de campañas", "Reportes mensuales"]');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_contact_id ON proposals(contact_id);
CREATE INDEX IF NOT EXISTS idx_proposals_service_id ON proposals(service_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposal_communications_proposal_id ON proposal_communications(proposal_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
