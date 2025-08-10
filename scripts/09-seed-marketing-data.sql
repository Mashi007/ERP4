-- Insertar listas de marketing
INSERT INTO marketing_lists (name, description, status, tags) VALUES
('Lista Principal', 'Todos los contactos activos del CRM', 'active', '{"Clientes", "Activos"}'),
('Nuevos Suscriptores', 'Contactos que se suscribieron en los últimos 30 días', 'active', '{"Nuevos", "Suscriptores"}'),
('Clientes VIP', 'Clientes de alto valor con compras superiores a $5000', 'active', '{"VIP", "Premium"}'),
('Inactivos', 'Contactos que no han interactuado en los últimos 90 días', 'active', '{"Inactivos", "Re-engagement"}');

-- Insertar campañas de marketing
INSERT INTO marketing_campaigns (name, type, status, subject, content, list_id, scheduled_at, sent_at, sent_count, opened_count, clicked_count, open_rate, click_rate, created_by) VALUES
('Lanzamiento Producto Q1', 'email', 'completed', '🚀 Nuevo Producto Disponible - Descuento Exclusivo', 'Descubre nuestro nuevo producto con un 20% de descuento exclusivo para clientes VIP.', 1, '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00', 1250, 456, 89, 36.5, 7.1, 'Daniel Casañas'),
('Promoción Envío Gratis', 'email', 'completed', '🚚 Envío Gratis en Todos los Pedidos', 'Por tiempo limitado, disfruta de envío gratuito en todas tus compras.', 2, '2024-01-08 14:30:00+00', '2024-01-08 14:30:00+00', 980, 412, 156, 42.0, 15.9, 'Daniel Casañas'),
('Programa Referidos', 'email', 'draft', '👥 Refiere y Gana - Programa de Referidos', 'Gana recompensas por cada amigo que refiera a nuestros servicios.', 3, NULL, NULL, 0, 0, 0, 0, 0, 'Daniel Casañas'),
('Descuento Nuevos Usuarios', 'email', 'scheduled', '💰 Bienvenido - 15% de Descuento', 'Como nuevo suscriptor, disfruta de un 15% de descuento en tu primera compra.', 2, '2024-01-20 09:00:00+00', NULL, 0, 0, 0, 0, 0, 'Daniel Casañas');

-- Insertar plantillas de campaña
INSERT INTO campaign_templates (name, type, subject, content, tags, created_by) VALUES
('Bienvenida Nuevos Clientes', 'email', '¡Bienvenido a [EMPRESA]!', 'Hola [NOMBRE], gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros.', '{"Bienvenida", "Onboarding"}', 'Daniel Casañas'),
('Promoción Mensual', 'email', 'Oferta Especial - Solo por este mes', 'No te pierdas nuestra oferta especial del mes. Descuentos de hasta 30% en productos seleccionados.', '{"Promoción", "Descuento"}', 'Daniel Casañas'),
('Recordatorio Carrito Abandonado', 'email', 'Olvidaste algo en tu carrito', 'Hola [NOMBRE], notamos que dejaste algunos artículos en tu carrito. ¡Completa tu compra ahora!', '{"Carrito", "Recordatorio"}', 'Daniel Casañas');

-- Insertar relaciones entre listas y contactos
INSERT INTO marketing_list_contacts (list_id, contact_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(1, 3, 'active'),
(1, 4, 'active'),
(1, 5, 'active'),
(2, 1, 'active'),
(2, 4, 'active'),
(3, 3, 'active'),
(3, 5, 'active'),
(4, 2, 'active');
