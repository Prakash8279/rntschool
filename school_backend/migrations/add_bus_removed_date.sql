-- Add removed_date column to bus_student_assignments table
ALTER TABLE bus_student_assignments 
ADD COLUMN IF NOT EXISTS removed_date DATE AFTER assigned_date;

-- Update existing inactive records to have a removed_date (if not already set)
-- This sets a placeholder date for historical records
UPDATE bus_student_assignments 
SET removed_date = updated_at 
WHERE is_active = 0 AND removed_date IS NULL;
