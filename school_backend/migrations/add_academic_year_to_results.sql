-- Migration: Add academic_year column to exam_results table
-- Run this SQL in phpMyAdmin if you already have the exam_results table

-- Add academic_year column if it doesn't exist
ALTER TABLE exam_results 
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) AFTER remarks;

-- Add index for class and exam combination
ALTER TABLE exam_results 
ADD INDEX IF NOT EXISTS idx_class_exam (classname, exam_name);

-- Verify the change
DESCRIBE exam_results;
