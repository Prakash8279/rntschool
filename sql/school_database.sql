-- =====================================================
-- SCHOOL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Database: school
-- Created: January 2026
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS school;
USE school;

-- =====================================================
-- 1. USERS TABLE (Admin, Finance, StudentManager)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role ENUM('admin', 'finance', 'studentManager') NOT NULL DEFAULT 'admin',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(20),
    student_name VARCHAR(100) NOT NULL,
    classname VARCHAR(20) NOT NULL,
    address TEXT,
    contact_no VARCHAR(15),
    gender ENUM('Male', 'Female', 'Other'),
    dob DATE,
    age INT,
    email VARCHAR(100),
    registration_fees DECIMAL(10, 2) DEFAULT 0,
    image VARCHAR(500),
    uses_bus BOOLEAN DEFAULT FALSE,
    pan_no VARCHAR(20),
    weight VARCHAR(10),
    height VARCHAR(10),
    aadhar_no VARCHAR(20),
    previous_school_name VARCHAR(200),
    alternate_mobile_no VARCHAR(15),
    father_name VARCHAR(100),
    father_aadhar_no VARCHAR(20),
    mother_name VARCHAR(100),
    mother_aadhar_no VARCHAR(20),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. TEACHERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    aadhar_no VARCHAR(20),
    pan_no VARCHAR(20),
    address TEXT,
    gender ENUM('Male', 'Female', 'Other'),
    contact_no VARCHAR(15),
    qualification VARCHAR(100),
    subjects_to_teach JSON,
    class_teacher_of VARCHAR(20),
    previous_school VARCHAR(200),
    dob DATE,
    age INT,
    estimated_salary DECIMAL(10, 2),
    image VARCHAR(500),
    joining_date DATE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. STAFF TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    aadhar_no VARCHAR(20),
    pan_no VARCHAR(20),
    address TEXT,
    work_role VARCHAR(100),
    gender ENUM('Male', 'Female', 'Other'),
    contact_no VARCHAR(15),
    qualification VARCHAR(100),
    previous_school VARCHAR(200),
    dob DATE,
    age INT,
    salary DECIMAL(10, 2),
    image VARCHAR(500),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. FEE STRUCTURE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fee_structure (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classname VARCHAR(20) UNIQUE NOT NULL,
    admission_fee DECIMAL(10, 2) DEFAULT 0,
    monthly_fee DECIMAL(10, 2) DEFAULT 0,
    annual_fee DECIMAL(10, 2) DEFAULT 0,
    exam_fee DECIMAL(10, 2) DEFAULT 0,
    other_fee DECIMAL(10, 2) DEFAULT 0,
    fine DECIMAL(10, 2) DEFAULT 0,
    bus_fee DECIMAL(10, 2) DEFAULT 0,
    dress_fee DECIMAL(10, 2) DEFAULT 0,
    book_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. FEE COLLECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fee_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    student_name VARCHAR(100),
    classname VARCHAR(20),
    roll_no VARCHAR(20),
    month VARCHAR(20),
    year VARCHAR(10),
    monthly_fees DECIMAL(10, 2) DEFAULT 0,
    exam_fees DECIMAL(10, 2) DEFAULT 0,
    annual_fee DECIMAL(10, 2) DEFAULT 0,
    other_fee DECIMAL(10, 2) DEFAULT 0,
    bus_fee DECIMAL(10, 2) DEFAULT 0,
    dress_fee DECIMAL(10, 2) DEFAULT 0,
    book_fee DECIMAL(10, 2) DEFAULT 0,
    fine DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME,
    notes TEXT,
    payment_mode ENUM('Cash', 'Online', 'Cheque', 'Bank Transfer') DEFAULT 'Cash',
    receipt_no VARCHAR(50) UNIQUE,
    uses_bus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admission_no (admission_no),
    INDEX idx_month_year (month, year)
);

-- =====================================================
-- 7. SALARIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS salaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    role ENUM('teacher', 'staff') NOT NULL,
    month VARCHAR(20) NOT NULL,
    year VARCHAR(10) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_salary (employee_id, month, year)
);

-- =====================================================
-- 8. ATTENDANCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    classname VARCHAR(20) NOT NULL,
    subject VARCHAR(50),
    student_records JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date_class (date, classname)
);

-- =====================================================
-- 9. TIMETABLE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classname VARCHAR(20) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    teacher_id INT,
    teacher_name VARCHAR(100),
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_class_day (classname, day)
);

-- =====================================================
-- 10. EXAM SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    exam_date DATE,
    classname VARCHAR(20) NOT NULL,
    subjects JSON,
    allow_download BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_class_exam (classname)
);

-- =====================================================
-- 11. EXAM RESULTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    admission_no VARCHAR(50) NOT NULL,
    classname VARCHAR(20) NOT NULL,
    exam_name VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    marks_obtained DECIMAL(5, 2),
    total_marks DECIMAL(5, 2) DEFAULT 100,
    grade VARCHAR(5),
    remarks TEXT,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_exam (admission_no, exam_name),
    INDEX idx_class_exam (classname, exam_name)
);

-- =====================================================
-- 12. ADMIT CARD ACCESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admit_card_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    is_allowed BOOLEAN DEFAULT FALSE,
    allowed_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_admission (admission_no)
);

-- =====================================================
-- 13. NOTICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_audience ENUM('all', 'students', 'teachers', 'staff') DEFAULT 'all',
    posted_by VARCHAR(100),
    is_important BOOLEAN DEFAULT FALSE,
    date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 14. EXPENSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 15. BUS ROUTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bus_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    route_number VARCHAR(20) UNIQUE,
    driver_name VARCHAR(100),
    driver_contact VARCHAR(15),
    capacity INT DEFAULT 50,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 16. BUS FEE CONFIG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bus_fee_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_bus_fee_enabled BOOLEAN DEFAULT TRUE,
    applicable_from_month VARCHAR(20) DEFAULT 'April',
    applicable_from_year INT,
    removable_from_month VARCHAR(20),
    removable_from_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 17. BUS STUDENT ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bus_student_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    admission_no VARCHAR(50) NOT NULL,
    student_name VARCHAR(100),
    classname VARCHAR(20),
    bus_route_id INT NOT NULL,
    pickup_point VARCHAR(200),
    pickup_time TIME,
    drop_time TIME,
    assigned_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_route_id) REFERENCES bus_routes(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_bus_route (bus_route_id)
);

-- =====================================================
-- 18. SITE CONTENT TABLE (Landing Page)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(50) UNIQUE NOT NULL,
    content JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- DEFAULT DATA INSERTS
-- =====================================================

-- Insert Default Admin User (Password: admin123)
INSERT IGNORE INTO users (name, email, password_hash, role, image_url) VALUES
('Admin', 'admin@school.com', '$2b$10$nigwh4VfT5XwPb6sSXNua.r.sG9tA9AiWhtfQMAvTcB1bNNQoSttm', 'admin', 'https://ui-avatars.com/api/?name=Admin');

-- NOTE: Default password for admin is 'admin123'
-- For students/teachers without password_hash, default password is '123456'

-- Insert Default Fee Structure for Classes
INSERT IGNORE INTO fee_structure (classname, admission_fee, monthly_fee, annual_fee, exam_fee, other_fee, fine, bus_fee, dress_fee, book_fee, discount) VALUES
('Nursery', 5000, 800, 0, 500, 0, 50, 1000, 2000, 1500, 0),
('LKG', 5000, 900, 0, 500, 0, 50, 1000, 2000, 1500, 0),
('UKG', 5000, 1000, 0, 500, 0, 50, 1000, 2000, 1500, 0),
('One', 6000, 1100, 0, 600, 0, 50, 1000, 2500, 2000, 0),
('Two', 6000, 1200, 0, 600, 0, 50, 1000, 2500, 2000, 0),
('Three', 6000, 1300, 0, 600, 0, 50, 1000, 2500, 2000, 0),
('Four', 7000, 1400, 0, 700, 0, 50, 1000, 3000, 2500, 0),
('Five', 7000, 1500, 0, 700, 0, 50, 1000, 3000, 2500, 0),
('Six', 8000, 1600, 0, 800, 0, 50, 1000, 3000, 3000, 0),
('Seven', 8000, 1700, 0, 800, 0, 50, 1000, 3000, 3000, 0),
('Eight', 8000, 1800, 0, 800, 0, 50, 1000, 3000, 3000, 0);

-- Insert Default Bus Routes
INSERT IGNORE INTO bus_routes (bus_name, route_number, driver_name, driver_contact, capacity, notes) VALUES
('Route A - North', 'A-101', 'Rajesh Kumar', '9876543210', 45, 'North side pick-up route'),
('Route B - South', 'B-102', 'Priya Sharma', '9876543211', 50, 'South side pick-up route'),
('Route C - East', 'C-103', 'Vikram Singh', '9876543212', 48, 'East side pick-up route'),
('Route D - West', 'D-104', 'Anjali Verma', '9876543213', 50, 'West side pick-up route');

-- Insert Default Bus Fee Config
INSERT IGNORE INTO bus_fee_config (is_bus_fee_enabled, applicable_from_month, applicable_from_year) VALUES
(TRUE, 'April', 2026);

-- Insert Default Site Content
INSERT IGNORE INTO site_content (section_name, content) VALUES
('landing_page', '{"schoolName": "R.N.T. PUBLIC SCHOOL", "tagline": "Nursery to 8th Grade Excellence", "heroText": "Building Tomorrow Leaders Today"}');

-- =====================================================
-- 19. ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    classname VARCHAR(20) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    teacher_id INT,
    teacher_name VARCHAR(100),
    due_date DATE,
    max_marks DECIMAL(5, 2) DEFAULT 100,
    attachment_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_class (classname),
    INDEX idx_teacher (teacher_id)
);

-- =====================================================
-- 20. ASSIGNMENT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    admission_no VARCHAR(50) NOT NULL,
    student_name VARCHAR(100),
    classname VARCHAR(20),
    submission_text TEXT,
    attachment_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks_obtained DECIMAL(5, 2),
    remarks TEXT,
    is_graded BOOLEAN DEFAULT FALSE,
    graded_by VARCHAR(100),
    graded_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id),
    INDEX idx_student (student_id),
    UNIQUE KEY unique_submission (assignment_id, admission_no)
);

-- =====================================================
-- 21. QUIZZES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    classname VARCHAR(20) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    teacher_id INT,
    teacher_name VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INT DEFAULT 30,
    total_marks DECIMAL(5, 2) DEFAULT 100,
    questions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_class (classname),
    INDEX idx_teacher (teacher_id)
);

-- =====================================================
-- 22. QUIZ SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    admission_no VARCHAR(50) NOT NULL,
    student_name VARCHAR(100),
    classname VARCHAR(20),
    answers JSON,
    started_at TIMESTAMP NULL DEFAULT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    auto_marks DECIMAL(5, 2) DEFAULT 0,
    manual_marks DECIMAL(5, 2) DEFAULT 0,
    total_marks DECIMAL(5, 2) DEFAULT 0,
    is_graded BOOLEAN DEFAULT FALSE,
    graded_by VARCHAR(100),
    graded_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id),
    INDEX idx_student (student_id),
    UNIQUE KEY unique_quiz_submission (quiz_id, admission_no)
);

-- =====================================================
-- END OF SCHEMA
-- =====================================================

