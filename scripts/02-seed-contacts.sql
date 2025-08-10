-- Insertar contactos de ejemplo
INSERT INTO contacts (name, email, phone, company, job_title, status, tags, sales_owner, avatar_url) VALUES
('Johnny Appleseed', 'johnny.appleseed@jetpropulsion.com', '+ Click to add', 'Jet Propulsion Labs', 'Manager Customer Relations', 'New', '{}', 'Daniel Casañas', ''),
('Spector Calista', 'spectorcalista@gmail.com', '+19266520001', 'Techcave', 'Co-founder', 'Qualified', '{"Industry Expert"}', 'Daniel Casañas', '/professional-man.png'),
('Jane Sampleton', 'janesampleton@gmail.com', '+19266529503', 'Widgetz.io', 'CEO', 'Qualified', '{"Decision maker"}', 'Daniel Casañas', '/professional-woman-diverse.png'),
('Emily Dean', 'emily.dean@globallearning.com', '+ Click to add', 'Global Learning Solutions', 'Chartered Accountant', 'New', '{}', 'Daniel Casañas', ''),
('Martha Jackson', 'marthajackson@gmail.com', '+19266091164', 'Optiscape Inc', 'COO', 'Won', '{"High-Value Customer"}', 'Daniel Casañas', '/confident-business-woman.png'),
('Kevin Jordan', 'kevinjordan@gmail.com', '+15898899911', 'Apex IQ', 'VP Marketing', 'Won', '{"Customer Advocate"}', 'Daniel Casañas', '/marketing-executive.png'),
('Syed Kareem', 'syedkareem@gmail.com', '+447456123456', 'Synth Corp', 'Project Manager', 'Qualified', '{"Influencer"}', 'Daniel Casañas', '/project-manager-team.png'),
('Heather White', 'heatherwhite@gmail.com', '+15436946523', 'Pivotal Tech', 'Head of IT', 'Qualified', '{"Champion"}', 'Daniel Casañas', '/it-director.png')
ON CONFLICT (email) DO NOTHING;
