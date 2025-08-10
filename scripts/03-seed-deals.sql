-- Insertar deals/oportunidades de ejemplo con campos adicionales
INSERT INTO deals (
    title, company, contact_id, value, stage, probability, expected_close_date, 
    notes, sales_owner, lead_source, industry, company_size, budget_range, 
    decision_timeline, pain_points, competitors, next_steps
) VALUES
(
    'Renovación ECorp', 'E Corp', 1, 4000.00, 'Nuevo', 25, '2024-08-15',
    'Cliente muy interesado, esperando aprobación del presupuesto', 'Daniel Casañas',
    'Referido', 'Tecnología', '201-1000', '$1,000 - $5,000', '1-3 meses',
    'Sistema actual obsoleto, necesitan modernización', 'Salesforce, HubSpot',
    'Enviar propuesta detallada la próxima semana'
),
(
    'Implementación Widgetz.io', 'Widgetz.io', 3, 5600.00, 'Nuevo', 30, '2024-10-15',
    'CRM - Plan Oro, necesidades específicas de integración', 'Daniel Casañas',
    'Website', 'Software', '51-200', '$5,000 - $25,000', '3-6 meses',
    'Crecimiento rápido, necesitan escalabilidad', 'Pipedrive, Zoho',
    'Programar demo técnica con equipo de desarrollo'
),
(
    'Consultoría Acme Inc', 'Acme Inc', 2, 100.00, 'Calificación', 15, '2024-08-30',
    'Startup pequeña, presupuesto limitado', 'Daniel Casañas',
    'Redes Sociales', 'Startup', '1-10', '< $1,000', 'Inmediato',
    'Presupuesto muy ajustado, buscan solución económica', 'Herramientas gratuitas',
    'Evaluar opciones de plan básico'
),
(
    'Desarrollo Synth Corp', 'Synth Corp', 7, 4100.00, 'Calificación', 40, '2024-08-20',
    'Proyecto anual de desarrollo', 'Daniel Casañas',
    'Evento', 'Manufactura', '51-200', '$1,000 - $5,000', '1-3 meses',
    'Procesos manuales ineficientes', 'SAP, Oracle',
    'Realizar análisis de procesos actuales'
),
(
    'Soporte Técnico Techcave', 'Techcave', 2, 3200.00, 'Negociación', 75, '2024-08-10',
    'CRM - Plan Oro, renovación de contrato', 'Daniel Casañas',
    'Cliente Existente', 'Tecnología', '11-50', '$1,000 - $5,000', 'Inmediato',
    'Satisfechos con servicio actual, quieren expandir', 'Ninguno identificado',
    'Finalizar términos de renovación'
),
(
    'Renovación Techcave', 'Techcave', 2, 3000.00, 'Ganado', 100, '2024-08-10',
    'CRM - Platinum, contrato cerrado', 'Daniel Casañas',
    'Cliente Existente', 'Tecnología', '11-50', '$1,000 - $5,000', 'Inmediato',
    'Upgrade a plan premium por crecimiento', 'N/A',
    'Implementar nuevas funcionalidades'
),
(
    'Consultoría Optiscape', 'Optiscape Inc', 5, 2100.00, 'Ganado', 100, '2024-08-05',
    'Sin productos adicionales', 'Daniel Casañas',
    'Referido', 'Consultoría', '51-200', '$1,000 - $5,000', 'Inmediato',
    'Optimización de procesos de ventas', 'N/A',
    'Comenzar implementación'
),
(
    'Marketing Digital Apex IQ', 'Apex IQ', 6, 4200.00, 'Ganado', 100, '2024-07-15',
    'CRM - Premium, proyecto completado', 'Daniel Casañas',
    'Email Marketing', 'Marketing', '51-200', '$1,000 - $5,000', 'Inmediato',
    'Integración con herramientas de marketing', 'N/A',
    'Proyecto completado exitosamente'
),
(
    'Soluciones Globales', 'Global Learning Solutions', 4, 3000.00, 'Ganado', 100, '2024-06-20',
    'Contrato anual firmado', 'Daniel Casañas',
    'Llamada Fría', 'Educación', '201-1000', '$1,000 - $5,000', 'Inmediato',
    'Gestión de estudiantes y cursos', 'N/A',
    'Renovación automática configurada'
)
ON CONFLICT DO NOTHING;
