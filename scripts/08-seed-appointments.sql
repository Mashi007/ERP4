-- Insertar datos de ejemplo para citas
INSERT INTO appointments (title, contact_id, deal_id, company, appointment_date, appointment_time, duration, type, location, status, notes, sales_owner) VALUES
('Reunión de seguimiento - CRM Implementation', 1, 1, 'Jet Propulsion Labs', '2024-01-15', '10:00', 60, 'meeting', 'Oficina principal', 'confirmed', 'Revisar progreso de implementación y próximos pasos', 'Daniel Casañas'),
('Demo de producto - Marketing Digital', 3, 2, 'Widgetz.io', '2024-01-15', '14:30', 45, 'demo', 'Video llamada', 'confirmed', 'Demostración de funcionalidades avanzadas', 'Daniel Casañas'),
('Consulta inicial - Desarrollo Web', 2, 3, 'Techcave', '2024-01-16', '09:30', 30, 'consultation', 'Café Central', 'pending', 'Primera reunión para entender necesidades', 'Daniel Casañas'),
('Presentación de propuesta', 5, 7, 'Optiscape Inc', '2024-01-16', '16:00', 90, 'presentation', 'Oficina del cliente', 'confirmed', 'Presentación final de la propuesta comercial', 'Daniel Casañas'),
('Llamada de cierre', 6, 8, 'Apex IQ', '2024-01-17', '11:00', 30, 'call', 'Llamada telefónica', 'confirmed', 'Cerrar detalles finales del contrato', 'Daniel Casañas'),
('Reunión de planificación', 7, 4, 'Synth Corp', '2024-01-18', '15:00', 60, 'meeting', 'Oficina Synth Corp', 'pending', 'Planificar fases del proyecto de desarrollo', 'Daniel Casañas'),
('Demo técnica avanzada', 8, NULL, 'Pivotal Tech', '2024-01-19', '10:30', 120, 'demo', 'Video llamada', 'confirmed', 'Demostración técnica detallada de la plataforma', 'Daniel Casañas'),
('Revisión de contrato', 4, 9, 'Global Learning Solutions', '2024-01-20', '13:00', 45, 'meeting', 'Oficina principal', 'confirmed', 'Revisar términos y condiciones del contrato anual', 'Daniel Casañas');
