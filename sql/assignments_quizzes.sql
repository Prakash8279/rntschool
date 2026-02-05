-- =====================================================
-- ASSIGNMENTS & QUIZZES TABLES
-- =====================================================

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

-- Questions JSON format:
-- [
--   {
--     "id": 1,
--     "question": "What is 2+2?",
--     "type": "mcq",
--     "options": ["2", "3", "4", "5"],
--     "correct_answer": "4",
--     "marks": 5
--   },
--   {
--     "id": 2,
--     "question": "Explain photosynthesis",
--     "type": "text",
--     "marks": 10
--   }
-- ]

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

-- Answers JSON format:
-- [
--   {"question_id": 1, "answer": "4"},
--   {"question_id": 2, "answer": "Photosynthesis is the process..."}
-- ]
