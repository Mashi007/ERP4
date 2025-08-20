-- Create communications table for mass communication tracking
CREATE TABLE IF NOT EXISTS communications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'whatsapp')),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    template_used VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    deal_id INTEGER REFERENCES deals(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_communications_type ON communications(type);
CREATE INDEX IF NOT EXISTS idx_communications_deal_id ON communications(deal_id);
CREATE INDEX IF NOT EXISTS idx_communications_sent_at ON communications(sent_at);

-- Add some sample communication templates
INSERT INTO communications (type, recipient_email, subject, message, template_used, deal_id) VALUES
('email', 'sample@example.com', 'Seguimiento de Propuesta', 'Estimado cliente, queremos hacer seguimiento a su propuesta...', 'follow_up_template', NULL),
('whatsapp', NULL, NULL, 'Hola! Queremos hacer seguimiento a su interés en nuestros servicios.', 'whatsapp_follow_up', NULL)
ON CONFLICT DO NOTHING;
