-- Migration: Remove annual_fee column from fee_structure table
-- Date: 2026-02-05
-- Description: Removing unused annual_fee column as admission_fee is now used instead

-- Remove annual_fee column from fee_structure table
ALTER TABLE fee_structure DROP COLUMN IF EXISTS annual_fee;

-- Verify the change
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'fee_structure' 
  AND TABLE_SCHEMA = DATABASE();
