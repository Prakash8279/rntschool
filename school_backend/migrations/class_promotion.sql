-- Migration: Class Promotion System
-- Run this in your MySQL database

-- 1. Add previous_year_dues column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS previous_year_dues DECIMAL(10,2) DEFAULT 0;

-- 2. Add current_class column to track promotion history
ALTER TABLE students ADD COLUMN IF NOT EXISTS promotion_year INT DEFAULT NULL;

-- 3. Create class promotion history table
CREATE TABLE IF NOT EXISTS class_promotion_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    student_name VARCHAR(200),
    from_class VARCHAR(50) NOT NULL,
    to_class VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    dues_at_promotion DECIMAL(10,2) DEFAULT 0,
    promoted_by VARCHAR(100),
    promoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    INDEX idx_admission (admission_no),
    INDEX idx_academic_year (academic_year)
);

SELECT 'Class promotion migration completed!' as status;
