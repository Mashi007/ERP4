-- Verify that all required tables exist and have data
SELECT 
  'contacts' as table_name, 
  COUNT(*) as record_count 
FROM contacts
UNION ALL
SELECT 
  'deals' as table_name, 
  COUNT(*) as record_count 
FROM deals
UNION ALL
SELECT 
  'activities' as table_name, 
  COUNT(*) as record_count 
FROM activities
UNION ALL
SELECT 
  'appointments' as table_name, 
  COUNT(*) as record_count 
FROM appointments;
