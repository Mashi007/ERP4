-- Create pipelines configuration tables
CREATE TABLE IF NOT EXISTS pipelines (
  id SERIAL PRIMARY KEY,
  pipeline_name VARCHAR(100) NOT NULL UNIQUE,
  pipeline_label VARCHAR(200) NOT NULL,
  pipeline_description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  pipeline_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pipeline stages table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id SERIAL PRIMARY KEY,
  pipeline_id INTEGER NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  stage_name VARCHAR(100) NOT NULL,
  stage_label VARCHAR(200) NOT NULL,
  stage_order INTEGER NOT NULL DEFAULT 1,
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  is_active BOOLEAN DEFAULT true,
  is_closed BOOLEAN DEFAULT false,
  is_won BOOLEAN DEFAULT false,
  stage_color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pipeline_id, stage_name),
  UNIQUE(pipeline_id, stage_order)
);

-- Create pipeline flows table for stage transitions
CREATE TABLE IF NOT EXISTS pipeline_flows (
  id SERIAL PRIMARY KEY,
  from_stage_id INTEGER NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  to_stage_id INTEGER NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  flow_name VARCHAR(100) NOT NULL,
  flow_description TEXT,
  is_automatic BOOLEAN DEFAULT false,
  conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_stage_id, to_stage_id)
);

-- Insert default pipelines
INSERT INTO pipelines (pipeline_name, pipeline_label, pipeline_description, is_default, pipeline_order) VALUES
('ventas_principal', 'Pipeline Principal de Ventas', 'Pipeline estándar para el proceso de ventas', true, 1),
('ventas_corporativas', 'Ventas Corporativas', 'Pipeline especializado para clientes corporativos', false, 2),
('renovaciones', 'Renovaciones y Upselling', 'Pipeline para renovaciones de contratos existentes', false, 3)
ON CONFLICT (pipeline_name) DO NOTHING;

-- Insert default stages for main sales pipeline
INSERT INTO pipeline_stages (pipeline_id, stage_name, stage_label, stage_order, probability, is_closed, is_won, stage_color) VALUES
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_principal'), 'nuevo', 'Nuevo', 1, 10, false, false, '#3B82F6'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_principal'), 'calificacion', 'Calificación', 2, 25, false, false, '#8B5CF6'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_principal'), 'propuesta', 'Propuesta', 3, 50, false, false, '#F59E0B'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_principal'), 'negociacion', 'Negociación', 4, 75, false, false, '#EF4444'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_principal'), 'ganado', 'Ganado', 5, 100, true, true, '#10B981'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_principal'), 'perdido', 'Perdido', 6, 0, true, false, '#6B7280')
ON CONFLICT (pipeline_id, stage_name) DO NOTHING;

-- Insert stages for corporate sales pipeline
INSERT INTO pipeline_stages (pipeline_id, stage_name, stage_label, stage_order, probability, is_closed, is_won, stage_color) VALUES
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'prospecto', 'Prospecto', 1, 5, false, false, '#3B82F6'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'contacto_inicial', 'Contacto Inicial', 2, 15, false, false, '#6366F1'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'reunion_descubrimiento', 'Reunión de Descubrimiento', 3, 30, false, false, '#8B5CF6'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'demo_tecnica', 'Demo Técnica', 4, 45, false, false, '#A855F7'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'propuesta_comercial', 'Propuesta Comercial', 5, 60, false, false, '#F59E0B'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'revision_legal', 'Revisión Legal', 6, 80, false, false, '#F97316'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'ganado_corporativo', 'Ganado', 7, 100, true, true, '#10B981'),
((SELECT id FROM pipelines WHERE pipeline_name = 'ventas_corporativas'), 'perdido_corporativo', 'Perdido', 8, 0, true, false, '#6B7280')
ON CONFLICT (pipeline_id, stage_name) DO NOTHING;

-- Insert stages for renewals pipeline
INSERT INTO pipeline_stages (pipeline_id, stage_name, stage_label, stage_order, probability, is_closed, is_won, stage_color) VALUES
((SELECT id FROM pipelines WHERE pipeline_name = 'renovaciones'), 'renovacion_pendiente', 'Renovación Pendiente', 1, 70, false, false, '#3B82F6'),
((SELECT id FROM pipelines WHERE pipeline_name = 'renovaciones'), 'negociacion_renovacion', 'Negociación', 2, 85, false, false, '#F59E0B'),
((SELECT id FROM pipelines WHERE pipeline_name = 'renovaciones'), 'renovado', 'Renovado', 3, 100, true, true, '#10B981'),
((SELECT id FROM pipelines WHERE pipeline_name = 'renovaciones'), 'no_renovado', 'No Renovado', 4, 0, true, false, '#6B7280')
ON CONFLICT (pipeline_id, stage_name) DO NOTHING;

-- Insert default flows
INSERT INTO pipeline_flows (from_stage_id, to_stage_id, flow_name, flow_description) VALUES
(1, 2, 'nuevo_a_calificacion', 'Transición automática cuando se completa la información básica'),
(2, 3, 'calificacion_a_propuesta', 'Cuando el lead está calificado y listo para propuesta'),
(3, 4, 'propuesta_a_negociacion', 'Cuando la propuesta es aceptada y se inicia negociación');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_order ON pipeline_stages(pipeline_id, stage_order);
CREATE INDEX IF NOT EXISTS idx_pipeline_flows_from_stage ON pipeline_flows(from_stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_flows_to_stage ON pipeline_flows(to_stage_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_default ON pipelines(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_pipelines_active ON pipelines(is_active) WHERE is_active = true;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON pipeline_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pipeline_flows_updated_at BEFORE UPDATE ON pipeline_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one default pipeline
CREATE OR REPLACE FUNCTION ensure_single_default_pipeline()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE pipelines SET is_default = false WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_default_pipeline
    AFTER INSERT OR UPDATE ON pipelines
    FOR EACH ROW
    WHEN (NEW.is_default = true)
    EXECUTE FUNCTION ensure_single_default_pipeline();
