-- Migration to move all localStorage data to database

-- 1. Settings table for various configurations
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value LONGTEXT,
    setting_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Fee Structure table
CREATE TABLE IF NOT EXISTS fee_structures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    classname VARCHAR(50) NOT NULL UNIQUE,
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    annual_fee DECIMAL(10,2) DEFAULT 0,
    exam_fee DECIMAL(10,2) DEFAULT 0,
    library_fee DECIMAL(10,2) DEFAULT 0,
    sports_fee DECIMAL(10,2) DEFAULT 0,
    computer_fee DECIMAL(10,2) DEFAULT 0,
    laboratory_fee DECIMAL(10,2) DEFAULT 0,
    miscellaneous DECIMAL(10,2) DEFAULT 0,
    bus_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Landing Page Content table
CREATE TABLE IF NOT EXISTS landing_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(50) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(50) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_class_subject (class, subject_code)
);

-- Insert fee structures
INSERT INTO fee_structures (classname, monthly_fee, annual_fee, exam_fee, library_fee, sports_fee, computer_fee, laboratory_fee, miscellaneous, bus_fee) VALUES
('Nursery', 2000, 5000, 500, 300, 400, 0, 0, 200, 800),
('LKG', 2200, 5500, 600, 300, 400, 0, 0, 200, 800),
('UKG', 2400, 6000, 700, 300, 400, 0, 0, 200, 800),
('One', 2600, 6500, 800, 400, 500, 500, 300, 300, 1000),
('Two', 2800, 7000, 900, 400, 500, 600, 400, 300, 1000),
('Three', 3000, 7500, 1000, 500, 600, 700, 500, 400, 1200),
('Four', 3200, 8000, 1100, 500, 600, 800, 600, 400, 1200),
('Five', 3400, 8500, 1200, 600, 700, 900, 700, 500, 1500),
('Six', 3600, 9000, 1300, 600, 700, 1000, 800, 500, 1500),
('Seven', 3800, 9500, 1400, 700, 800, 1100, 900, 600, 1500)
ON DUPLICATE KEY UPDATE 
    monthly_fee = VALUES(monthly_fee),
    annual_fee = VALUES(annual_fee),
    exam_fee = VALUES(exam_fee),
    library_fee = VALUES(library_fee),
    sports_fee = VALUES(sports_fee),
    computer_fee = VALUES(computer_fee),
    laboratory_fee = VALUES(laboratory_fee),
    miscellaneous = VALUES(miscellaneous),
    bus_fee = VALUES(bus_fee);

-- Insert LKG subjects
INSERT INTO subjects (class, subject_name, subject_code) VALUES
('LKG', 'English', 'ENG'),
('LKG', 'Mathematics', 'MATH'),
('LKG', 'Environmental Science', 'EVS'),
('LKG', 'Art & Craft', 'ART'),
('LKG', 'Physical Education', 'PE')
ON DUPLICATE KEY UPDATE 
    subject_name = VALUES(subject_name);
