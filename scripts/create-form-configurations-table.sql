-- Create form_configurations table for dynamic form management
CREATE TABLE IF NOT EXISTS form_configurations (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL DEFAULT 'text',
    field_label VARCHAR(200) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    field_order INTEGER DEFAULT 0,
    field_options JSONB DEFAULT '{}',
    placeholder_text VARCHAR(200),
    validation_rules JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(form_type, field_name)
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_form_configurations_updated_at 
    BEFORE UPDATE ON form_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default configurations for opportunities form including the new Comercial field
INSERT INTO form_configurations (form_type, field_name, field_type, field_label, is_required, is_visible, field_order, placeholder_text) VALUES
('opportunities', 'comercial', 'text', 'Comercial', true, true, 1, 'Nombre del responsable de la oportunidad'),
('opportunities', 'contacto', 'text', 'Contacto', true, true, 2, 'Nombre del contacto principal'),
('opportunities', 'empresa', 'text', 'Empresa', true, true, 3, 'Nombre de la empresa'),
('opportunities', 'valor', 'number', 'Valor', true, true, 4, 'Valor estimado de la oportunidad'),
('opportunities', 'probabilidad', 'select', 'Probabilidad', true, true, 5, 'Seleccionar probabilidad'),
('opportunities', 'fecha_cierre', 'date', 'Fecha de Cierre', true, true, 6, 'Fecha estimada de cierre'),
('opportunities', 'etapa', 'select', 'Etapa', true, true, 7, 'Etapa actual de la oportunidad'),
('opportunities', 'fuente', 'select', 'Fuente', false, true, 8, 'Origen de la oportunidad'),
('opportunities', 'descripcion', 'textarea', 'Descripción', false, true, 9, 'Descripción detallada de la oportunidad'),
('opportunities', 'notas', 'textarea', 'Notas', false, true, 10, 'Notas adicionales');

-- Insert default configurations for funnel form
INSERT INTO form_configurations (form_type, field_name, field_type, field_label, is_required, is_visible, field_order, placeholder_text) VALUES
('funnel', 'nombre', 'text', 'Nombre', true, true, 1, 'Nombre del lead'),
('funnel', 'email', 'email', 'Email', true, true, 2, 'Correo electrónico'),
('funnel', 'telefono', 'tel', 'Teléfono', false, true, 3, 'Número de teléfono'),
('funnel', 'empresa', 'text', 'Empresa', false, true, 4, 'Nombre de la empresa'),
('funnel', 'cargo', 'text', 'Cargo', false, true, 5, 'Cargo o posición'),
('funnel', 'industria', 'select', 'Industria', false, true, 6, 'Sector industrial'),
('funnel', 'interes', 'select', 'Nivel de Interés', true, true, 7, 'Nivel de interés del lead'),
('funnel', 'fuente', 'select', 'Fuente', false, true, 8, 'Origen del lead'),
('funnel', 'puntuacion', 'number', 'Puntuación', false, true, 9, 'Puntuación del lead'),
('funnel', 'notas', 'textarea', 'Notas', false, true, 10, 'Notas adicionales');

-- Insert default configurations for contacts form
INSERT INTO form_configurations (form_type, field_name, field_type, field_label, is_required, is_visible, field_order, placeholder_text) VALUES
('contacts', 'nombre', 'text', 'Nombre', true, true, 1, 'Nombre completo'),
('contacts', 'email', 'email', 'Email', true, true, 2, 'Correo electrónico'),
('contacts', 'telefono', 'tel', 'Teléfono', false, true, 3, 'Número de teléfono'),
('contacts', 'empresa', 'text', 'Empresa', false, true, 4, 'Nombre de la empresa'),
('contacts', 'cargo', 'text', 'Cargo', false, true, 5, 'Cargo o posición'),
('contacts', 'direccion', 'text', 'Dirección', false, true, 6, 'Dirección física'),
('contacts', 'ciudad', 'text', 'Ciudad', false, true, 7, 'Ciudad'),
('contacts', 'pais', 'text', 'País', false, true, 8, 'País'),
('contacts', 'notas', 'textarea', 'Notas', false, true, 9, 'Notas adicionales');

-- Insert default configurations for appointments form
INSERT INTO form_configurations (form_type, field_name, field_type, field_label, is_required, is_visible, field_order, placeholder_text) VALUES
('appointments', 'titulo', 'text', 'Título', true, true, 1, 'Título de la cita'),
('appointments', 'contacto', 'text', 'Contacto', true, true, 2, 'Nombre del contacto'),
('appointments', 'fecha', 'date', 'Fecha', true, true, 3, 'Fecha de la cita'),
('appointments', 'hora', 'time', 'Hora', true, true, 4, 'Hora de la cita'),
('appointments', 'duracion', 'number', 'Duración (min)', true, true, 5, 'Duración en minutos'),
('appointments', 'tipo', 'select', 'Tipo', true, true, 6, 'Tipo de cita'),
('appointments', 'ubicacion', 'text', 'Ubicación', false, true, 7, 'Ubicación de la cita'),
('appointments', 'descripcion', 'textarea', 'Descripción', false, true, 8, 'Descripción de la cita'),
('appointments', 'notas', 'textarea', 'Notas', false, true, 9, 'Notas adicionales');

-- Insert default configurations for leads form
INSERT INTO form_configurations (form_type, field_name, field_type, field_label, is_required, is_visible, field_order, placeholder_text) VALUES
('leads', 'nombre', 'text', 'Nombre', true, true, 1, 'Nombre del lead'),
('leads', 'email', 'email', 'Email', true, true, 2, 'Correo electrónico'),
('leads', 'telefono', 'tel', 'Teléfono', false, true, 3, 'Número de teléfono'),
('leads', 'empresa', 'text', 'Empresa', false, true, 4, 'Nombre de la empresa'),
('leads', 'cargo', 'text', 'Cargo', false, true, 5, 'Cargo o posición'),
('leads', 'interes', 'select', 'Interés', true, true, 6, 'Nivel de interés'),
('leads', 'fuente', 'select', 'Fuente', false, true, 7, 'Origen del lead'),
('leads', 'estado', 'select', 'Estado', true, true, 8, 'Estado del lead'),
('leads', 'puntuacion', 'number', 'Puntuación', false, true, 9, 'Puntuación del lead'),
('leads', 'notas', 'textarea', 'Notas', false, true, 10, 'Notas adicionales');
