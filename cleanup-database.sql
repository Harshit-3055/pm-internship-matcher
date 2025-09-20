-- Cleanup script - Drop existing tables and start fresh
-- Run this first, then run simple-database-setup.sql

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS student_feedback CASCADE;
DROP TABLE IF EXISTS matching_logs CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

-- Drop any functions that might exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Verify tables are dropped
SELECT 'Cleanup completed' as status;
