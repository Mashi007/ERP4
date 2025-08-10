-- Insertar actividades de ejemplo
INSERT INTO activities (type, title, contact_id, deal_id, company, activity_date, activity_time, duration, status, notes, sales_owner) VALUES
('call', 'Llamada de seguimiento', 1, 1, 'Jet Propulsion Labs', '2024-01-15', '10:30', 30, 'Completada', 'Discutimos los requerimientos del proyecto CRM', 'Daniel Casañas'),
('email', 'Envío de propuesta', 3, 2, 'Widgetz.io', '2024-01-15', '11:15', 15, 'Completada', 'Propuesta enviada con detalles de servicios', 'Daniel Casañas'),
('meeting', 'Reunión de presentación', 7, 4, 'Synth Corp', '2024-01-15', '14:00', 60, 'Programada', 'Presentación de soluciones para startup', 'Daniel Casañas'),
('call', 'Llamada de cierre', 5, 7, 'Optiscape Inc', '2024-01-15', '15:30', 45, 'Programada', 'Finalizar detalles del contrato anual', 'Daniel Casañas'),
('meeting', 'Demo del producto', 6, 8, 'Apex IQ', '2024-01-16', '09:00', 90, 'Programada', 'Demostración completa de la plataforma', 'Daniel Casañas'),
('opportunity_created', 'Nueva oportunidad: Renovación ECorp', 1, 1, 'E Corp', '2024-01-10', NULL, NULL, 'Completada', 'Oportunidad creada automáticamente desde el pipeline', 'Daniel Casañas'),
('stage_change', 'Cambio de etapa a: Negociación', NULL, 5, 'Techcave', '2024-01-12', NULL, NULL, 'Completada', 'La oportunidad avanzó a etapa de negociación', 'Daniel Casañas'),
('stage_change', 'Cambio de etapa a: Ganado', NULL, 6, 'Techcave', '2024-01-13', NULL, NULL, 'Completada', 'Oportunidad cerrada exitosamente', 'Daniel Casañas')
ON CONFLICT DO NOTHING;
