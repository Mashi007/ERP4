-- Insertar conversaciones de ejemplo
INSERT INTO conversations (contact_id, subject, status, last_message_at) VALUES
(1, 'Propuesta de implementación CRM', 'active', '2024-01-15 10:30:00+00'),
(3, 'Re: Consultoría Marketing Digital', 'active', '2024-01-15 09:15:00+00'),
(2, 'Presupuesto desarrollo web', 'active', '2024-01-14 16:45:00+00'),
(5, 'Seguimiento proyecto Optiscape', 'active', '2024-01-14 14:20:00+00'),
(6, 'Propuesta Marketing Digital Apex IQ', 'archived', '2024-01-10 11:30:00+00');

-- Insertar mensajes de ejemplo
INSERT INTO messages (conversation_id, sender_type, sender_name, sender_email, content, message_type, is_read, sent_at) VALUES
(1, 'contact', 'Johnny Appleseed', 'johnny.appleseed@jetpropulsion.com', 'Hola Daniel, hemos revisado la propuesta de implementación del CRM y nos parece muy interesante. ¿Podríamos programar una reunión para discutir los detalles?', 'text', true, '2024-01-15 09:00:00+00'),
(1, 'user', 'Daniel Casañas', 'daniel@empresa.com', 'Por supuesto Johnny, me alegra saber que la propuesta es de su interés. ¿Qué tal el martes a las 10:00 AM? Podemos hacer una videollamada o reunirnos en su oficina.', 'text', true, '2024-01-15 09:15:00+00'),
(1, 'contact', 'Johnny Appleseed', 'johnny.appleseed@jetpropulsion.com', 'Perfecto, el martes a las 10:00 AM nos viene bien. Preferiríamos que fuera en nuestra oficina. Te envío la dirección por separado.', 'text', true, '2024-01-15 10:30:00+00'),

(2, 'contact', 'Jane Sampleton', 'janesampleton@gmail.com', 'Daniel, necesitamos una consultoría especializada en marketing digital para nuestro nuevo producto. ¿Podrías enviarnos información sobre sus servicios?', 'text', true, '2024-01-14 16:00:00+00'),
(2, 'user', 'Daniel Casañas', 'daniel@empresa.com', 'Hola Jane, gracias por contactarnos. Te envío nuestra propuesta de consultoría en marketing digital. Incluye análisis de mercado, estrategia de contenidos y campañas pagadas.', 'text', true, '2024-01-14 18:30:00+00'),
(2, 'contact', 'Jane Sampleton', 'janesampleton@gmail.com', 'Excelente propuesta Daniel. Los precios están dentro de nuestro presupuesto. ¿Cuándo podríamos empezar?', 'text', true, '2024-01-15 09:15:00+00'),

(3, 'contact', 'Spector Calista', 'spectorcalista@gmail.com', 'Hola, somos una startup tecnológica y necesitamos desarrollar nuestro sitio web corporativo. ¿Podrían ayudarnos con esto?', 'text', true, '2024-01-14 10:00:00+00'),
(3, 'user', 'Daniel Casañas', 'daniel@empresa.com', 'Hola Spector, por supuesto podemos ayudarles. Nos especializamos en desarrollo web para startups. ¿Podrías contarme más sobre sus necesidades específicas?', 'text', true, '2024-01-14 12:30:00+00'),
(3, 'contact', 'Spector Calista', 'spectorcalista@gmail.com', 'Necesitamos un sitio moderno, responsive, con sección de productos, blog y formulario de contacto. También integración con redes sociales.', 'text', true, '2024-01-14 16:45:00+00');

-- Insertar configuraciones de comunicación de ejemplo
INSERT INTO communication_settings (user_id, provider_type, provider_name, is_connected, is_favorite, account_email, settings) VALUES
('daniel_casanas', 'email', 'Gmail', true, true, 'daniel@empresa.com', '{"smtp_server": "smtp.gmail.com", "port": 587, "use_tls": true}'),
('daniel_casanas', 'email', 'Outlook', false, false, NULL, '{}'),
('daniel_casanas', 'sms', 'Twilio', true, false, NULL, '{"account_sid": "AC***", "auth_token": "***", "phone_number": "+1234567890"}'),
('daniel_casanas', 'whatsapp', 'WhatsApp Business', false, false, NULL, '{}'),
('daniel_casanas', 'social', 'LinkedIn', true, false, 'daniel.casanas@linkedin.com', '{"api_key": "***", "access_token": "***"}');
