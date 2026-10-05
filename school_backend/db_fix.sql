CREATE TABLE IF NOT EXISTS exam_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classname VARCHAR(50) NOT NULL,
    exam_name VARCHAR(100) NOT NULL,
    exam_date VARCHAR(50),
    subjects JSON,
    allow_download BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admit_card_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(50) NOT NULL,
    is_allowed BOOLEAN DEFAULT FALSE,
    allowed_date VARCHAR(50),
    UNIQUE KEY (admission_no)
);
