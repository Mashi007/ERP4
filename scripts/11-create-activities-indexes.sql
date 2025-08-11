-- Migration: add indexes to speed up activities queries
-- Safe to run multiple times due to IF NOT EXISTS.

BEGIN;

-- Typical access patterns:
-- - List activities for a deal ordered by most recent date.
-- - List activities for a contact ordered by most recent date.
-- - Filter activities by date ranges (dashboards, reports).

-- Composite indexes (cover filter + sort):
CREATE INDEX IF NOT EXISTS idx_activities_deal_id_activity_date_desc
  ON activities (deal_id, activity_date DESC);

CREATE INDEX IF NOT EXISTS idx_activities_contact_id_activity_date_desc
  ON activities (contact_id, activity_date DESC);

-- Single-column index for date range scans:
CREATE INDEX IF NOT EXISTS idx_activities_activity_date
  ON activities (activity_date);

COMMIT;
