-- =====================================================
-- QUICK COMMANDS REFERENCE
-- =====================================================

-- =============== CREATE DATABASE ===============
-- Run school_database.sql first to create all tables

-- =============== ADD SAMPLE DATA ===============
-- Run seed_data.sql to add test data

-- =============== USEFUL QUERIES ===============

-- Check all tables
SHOW TABLES;

-- View students count per class
SELECT classname, COUNT(*) as count FROM students GROUP BY classname;

-- View total fee collection
SELECT SUM(total_amount) as total_collection FROM fee_collections;

-- View monthly fee collection
SELECT month, year, SUM(total_amount) as total 
FROM fee_collections 
GROUP BY month, year 
ORDER BY year DESC, month;

-- View students with pending fees (students who haven't paid this month)
SELECT s.admission_no, s.student_name, s.classname 
FROM students s 
WHERE s.admission_no NOT IN (
    SELECT DISTINCT admission_no 
    FROM fee_collections 
    WHERE month = 'January' AND year = '2026'
);

-- View bus users
SELECT admission_no, student_name, classname FROM students WHERE uses_bus = TRUE;

-- View attendance for a specific date
SELECT * FROM attendance WHERE date = '2026-01-22';

-- View salary paid in current year
SELECT employee_name, role, month, amount 
FROM salaries 
WHERE year = '2026' 
ORDER BY payment_date DESC;

-- =============== RESET DATABASE ===============
-- WARNING: This will delete all data!

-- Drop all tables
-- DROP DATABASE school;
-- CREATE DATABASE school;

-- Then run school_database.sql again

-- =====================================================
