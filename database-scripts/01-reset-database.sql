-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- DANGER DANGER DANGER: 
-- This script will permanently delete all data from the 'reviews' and 'programs' tables.
-- It is for development use only.
-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

-- Temporarily disable the foreign key safety check.
SET FOREIGN_KEY_CHECKS = 0;

-- Empty the tables. We truncate the child table first.
TRUNCATE TABLE reviews;
TRUNCATE TABLE programs;

-- Immediately re-enable the safety check.
SET FOREIGN_KEY_CHECKS = 1;

-- Confirm the tables are empty.
SELECT * FROM programs;
SELECT * FROM reviews;