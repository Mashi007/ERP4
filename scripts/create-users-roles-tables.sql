-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Create user_permissions table for individual user permissions
CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission_id)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Administrador', 'Acceso completo al sistema con permisos de administración'),
('Comercial', 'Acceso a funciones de ventas y gestión de clientes'),
('Marketing', 'Acceso a funciones de marketing y campañas'),
('Supervisor', 'Acceso de supervisión con permisos limitados de administración')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, category) VALUES
('dashboard_view', 'Ver Dashboard', 'Dashboard'),
('contacts_view', 'Ver Contactos', 'Contactos'),
('contacts_create', 'Crear Contactos', 'Contactos'),
('contacts_edit', 'Editar Contactos', 'Contactos'),
('contacts_delete', 'Eliminar Contactos', 'Contactos'),
('deals_view', 'Ver Oportunidades', 'Ventas'),
('deals_create', 'Crear Oportunidades', 'Ventas'),
('deals_edit', 'Editar Oportunidades', 'Ventas'),
('deals_delete', 'Eliminar Oportunidades', 'Ventas'),
('appointments_view', 'Ver Citas', 'Citas'),
('appointments_create', 'Crear Citas', 'Citas'),
('appointments_edit', 'Editar Citas', 'Citas'),
('marketing_view', 'Ver Marketing', 'Marketing'),
('marketing_create', 'Crear Campañas', 'Marketing'),
('reports_view', 'Ver Reportes', 'Reportes'),
('settings_view', 'Ver Configuración', 'Configuración'),
('settings_edit', 'Editar Configuración', 'Configuración'),
('users_manage', 'Gestionar Usuarios', 'Administración'),
('system_admin', 'Administrador del Sistema', 'Administración')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Administrador role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Administrador'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Comercial role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Comercial' 
AND p.name IN ('dashboard_view', 'contacts_view', 'contacts_create', 'contacts_edit', 'deals_view', 'deals_create', 'deals_edit', 'appointments_view', 'appointments_create', 'appointments_edit')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Marketing role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Marketing' 
AND p.name IN ('dashboard_view', 'contacts_view', 'marketing_view', 'marketing_create', 'reports_view')
ON CONFLICT (role_id, permission_id) DO NOTHING;
