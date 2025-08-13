-- Configuración de Negocios y Embudos
CREATE TABLE IF NOT EXISTS deal_fields (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, number, select, date, boolean
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  options TEXT, -- JSON para opciones de select
  default_value TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_activity_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7), -- hex color
  is_active BOOLEAN DEFAULT true,
  requires_outcome BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_activity_outcomes (
  id SERIAL PRIMARY KEY,
  activity_type_id INTEGER REFERENCES sales_activity_types(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_positive BOOLEAN DEFAULT true,
  next_activity_suggestion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pipelines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id SERIAL PRIMARY KEY,
  pipeline_id INTEGER REFERENCES pipelines(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  probability INTEGER DEFAULT 0, -- 0-100
  position INTEGER DEFAULT 0,
  color VARCHAR(7), -- hex color
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  activity_type_id INTEGER REFERENCES sales_activity_types(id),
  goal_type VARCHAR(50) NOT NULL, -- weekly, monthly, quarterly
  target_count INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_quotas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  quota_type VARCHAR(50) NOT NULL, -- monthly, quarterly, yearly
  target_amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES product_categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  category_id INTEGER REFERENCES product_categories(id),
  base_price DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  tax_rate DECIMAL(5,2) DEFAULT 0,
  is_service BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO sales_activity_types (name, description, icon, color) VALUES
('Llamada', 'Llamada telefónica', 'phone', '#3B82F6'),
('Reunión', 'Reunión presencial o virtual', 'calendar', '#10B981'),
('Email', 'Correo electrónico', 'mail', '#8B5CF6'),
('Tarea', 'Tarea o seguimiento', 'check-square', '#F59E0B'),
('Nota', 'Nota o comentario', 'file-text', '#6B7280');

INSERT INTO pipelines (name, description, is_default) VALUES
('Pipeline Principal', 'Pipeline principal de ventas', true);

INSERT INTO pipeline_stages (pipeline_id, name, probability, position, color) VALUES
(1, 'Prospecto', 10, 1, '#EF4444'),
(1, 'Calificado', 25, 2, '#F97316'),
(1, 'Propuesta', 50, 3, '#EAB308'),
(1, 'Negociación', 75, 4, '#22C55E'),
(1, 'Cerrado Ganado', 100, 5, '#10B981'),
(1, 'Cerrado Perdido', 0, 6, '#6B7280');

INSERT INTO product_categories (name, description) VALUES
('Servicios', 'Servicios profesionales'),
('Productos', 'Productos físicos'),
('Software', 'Licencias de software'),
('Consultoría', 'Servicios de consultoría');
