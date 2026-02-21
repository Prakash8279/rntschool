-- Optimize Fee Management Queries with Proper Indexes
-- This migration adds indexes to improve query performance for large datasets

-- Index for fee_collections table (most frequently queried)
-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_fee_collections_admission_year 
ON fee_collections(admission_no, year);

CREATE INDEX IF NOT EXISTS idx_fee_collections_classname_year 
ON fee_collections(classname, year);

CREATE INDEX IF NOT EXISTS idx_fee_collections_payment_date 
ON fee_collections(payment_date DESC);

CREATE INDEX IF NOT EXISTS idx_fee_collections_month_year 
ON fee_collections(month, year);

-- Index for students table (frequently joined)
CREATE INDEX IF NOT EXISTS idx_students_admission_no 
ON students(admission_no);

CREATE INDEX IF NOT EXISTS idx_students_classname 
ON students(classname);

-- Index for fee_dues table
CREATE INDEX IF NOT EXISTS idx_fee_dues_admission_no 
ON fee_dues(admission_no);

-- Index for fee_structure table
CREATE INDEX IF NOT EXISTS idx_fee_structure_classname 
ON fee_structure(classname);

-- Analyze tables to update statistics
ANALYZE TABLE fee_collections;
ANALYZE TABLE students;
ANALYZE TABLE fee_dues;
ANALYZE TABLE fee_structure;
