-- Migration: Add admission_date column to students table
-- Purpose: Track actual admission/registration date for accurate fee calculation
-- Date: 2026-02-14

-- Add admission_date column to students table
ALTER TABLE students 
ADD COLUMN admission_date DATE NULL AFTER dob;

-- Set existing students' admission_date to their created_at date as a reasonable default
UPDATE students 
SET admission_date = DATE(created_at) 
WHERE admission_date IS NULL;

-- Add index for better query performance
CREATE INDEX idx_students_admission_date ON students(admission_date);

-- Add comment for documentation
ALTER TABLE students 
MODIFY COLUMN admission_date DATE NULL COMMENT 'Date when student was admitted/registered';
