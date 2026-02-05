-- Migration: Enhanced Fee Management System
-- Run this to add advanced features to fee management

-- =====================================================
-- 1. ADD NEW COLUMNS TO FEE_COLLECTIONS
-- =====================================================

-- Add late_fee column
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10,2) DEFAULT 0;

-- Add scholarship column for waivers
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS scholarship DECIMAL(10,2) DEFAULT 0;

-- Add partial payment tracking
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS is_partial TINYINT(1) DEFAULT 0;

-- Add payment type
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS payment_type ENUM('full', 'partial', 'advance') DEFAULT 'full';

-- Add academic year tracking
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS academic_year VARCHAR(10);

-- =====================================================
-- 2. CREATE FEE LEDGER TABLE (Track Monthly Status)
-- =====================================================

CREATE TABLE IF NOT EXISTS fee_ledger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    month VARCHAR(20) NOT NULL,
    year VARCHAR(10) NOT NULL,
    expected_amount DECIMAL(10,2) DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_status ENUM('pending', 'partial', 'paid', 'waived') DEFAULT 'pending',
    last_payment_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_fee_month (admission_no, month, year),
    INDEX idx_admission (admission_no),
    INDEX idx_status (payment_status)
);

-- =====================================================
-- 3. CREATE LATE FEE CONFIG TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS late_fee_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_enabled TINYINT(1) DEFAULT 0,
    fee_type ENUM('fixed', 'percentage', 'per_day') DEFAULT 'fixed',
    fixed_amount DECIMAL(10,2) DEFAULT 50,
    percentage DECIMAL(5,2) DEFAULT 5,
    per_day_amount DECIMAL(10,2) DEFAULT 10,
    grace_period_days INT DEFAULT 10,
    max_late_fee DECIMAL(10,2) DEFAULT 500,
    due_day_of_month INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default config
INSERT IGNORE INTO late_fee_config (id, is_enabled, fee_type, fixed_amount, grace_period_days, due_day_of_month)
VALUES (1, 0, 'fixed', 50, 10, 10);

-- =====================================================
-- 4. CREATE SCHOLARSHIP/WAIVER TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS fee_waivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    waiver_type ENUM('scholarship', 'sibling_discount', 'staff_ward', 'merit', 'financial_need', 'other') NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    applies_to ENUM('all', 'monthly', 'annual', 'bus') DEFAULT 'all',
    start_date DATE,
    end_date DATE,
    approved_by VARCHAR(100),
    notes TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admission (admission_no),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 5. CREATE FEE INSTALLMENT PLAN TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS fee_installments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    num_installments INT NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    fee_type VARCHAR(50) NOT NULL,
    start_date DATE,
    created_by VARCHAR(100),
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admission (admission_no),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS fee_installment_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    installment_plan_id INT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_date DATETIME,
    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    receipt_no VARCHAR(50),
    FOREIGN KEY (installment_plan_id) REFERENCES fee_installments(id) ON DELETE CASCADE,
    INDEX idx_plan (installment_plan_id),
    INDEX idx_status (status)
);

-- =====================================================
-- 6. ADD ADMISSION FEE COLUMN TO FEE STRUCTURE (if missing)
-- =====================================================

ALTER TABLE fee_structure ADD COLUMN IF NOT EXISTS admission_fee DECIMAL(10,2) DEFAULT 0;

-- =====================================================
-- 7. UPDATE STUDENTS TABLE FOR BUS TRACKING
-- =====================================================

ALTER TABLE students ADD COLUMN IF NOT EXISTS bus_start_date DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS bus_end_date DATE;

-- =====================================================
-- 8. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Index on fee_collections for faster queries
CREATE INDEX IF NOT EXISTS idx_fee_academic_year ON fee_collections(academic_year);
CREATE INDEX IF NOT EXISTS idx_fee_payment_date ON fee_collections(payment_date);
CREATE INDEX IF NOT EXISTS idx_fee_class_year ON fee_collections(classname, year);

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Migration completed successfully!' as status;
