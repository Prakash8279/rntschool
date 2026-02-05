-- Landing Page Management Tables

-- Landing Page Content Table (Home, About, Contact sections)
CREATE TABLE IF NOT EXISTS landing_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section VARCHAR(50) NOT NULL, -- 'home', 'about', 'contact', 'gallery'
  field_key VARCHAR(100) NOT NULL,
  field_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_section_field (section, field_key)
);

-- Gallery Images Table (supports both file upload and external URLs like Google Drive)
CREATE TABLE IF NOT EXISTS gallery_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Activities',
  emoji VARCHAR(50) DEFAULT '📸',
  image_path VARCHAR(500),
  external_url VARCHAR(1000),
  image_type ENUM('upload', 'external') DEFAULT 'upload',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Landing Page Notices Table (separate from existing notices)
CREATE TABLE IF NOT EXISTS landing_notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  notice_type ENUM('general', 'academic', 'event', 'holiday', 'exam') DEFAULT 'general',
  is_important BOOLEAN DEFAULT FALSE,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Landing Page Content
INSERT INTO landing_content (section, field_key, field_value) VALUES
-- Home Section
('home', 'badge', '🎨 Nursery to 8th Grade Excellence'),
('home', 'title', 'Where Young Minds'),
('home', 'titleHighlight', 'Grow & Thrive'),
('home', 'subtitle', 'A nurturing primary school environment where children from Nursery to 8th grade develop strong foundations in academics, character, and creativity through engaging, age-appropriate learning experiences! 🌈'),
('home', 'applyButtonText', 'Apply Now 🚀'),
('home', 'learnMoreButtonText', 'Learn More 📚'),
('home', 'stats_students_value', '400+'),
('home', 'stats_students_label', 'Happy Students 🎓'),
('home', 'stats_ratio_value', '30:1'),
('home', 'stats_ratio_label', 'Student-Teacher 👥'),
('home', 'stats_years_value', '10+'),
('home', 'stats_years_label', 'Years of Fun 🎉'),

-- About Section
('about', 'title', 'About Our'),
('about', 'titleHighlight', 'Primary School'),
('about', 'description', 'For over 25 years, we''ve been nurturing young minds from Nursery to 8th grade! Our primary school creates a safe, joyful environment where children build strong academic foundations while developing confidence, creativity, and essential life skills through play-based and experiential learning. 🌈✨'),
('about', 'missionTitle', 'Our Mission'),
('about', 'missionText', 'To nurture curious, confident, and kind young learners by providing an engaging primary education that sparks imagination, builds strong foundations, and instills values that will guide them throughout their educational journey and beyond! 🚀💫'),

-- Contact Section
('contact', 'title', 'Get in'),
('contact', 'titleHighlight', 'Touch'),
('contact', 'description', 'Interested in enrolling your child? We''d love to show you around our school and answer any questions about our Nursery to 8th grade programs! 🏫✨'),
('contact', 'phone', '+917061337068'),
('contact', 'email', 'rntpublics@gmail.com'),
('contact', 'address', 'R.N.T Public School Janki Nagar'),
('contact', 'formTitle', 'Send Us a Message 💌'),
('contact', 'formDescription', 'We typically respond within 24 hours! ⏰'),

-- Gallery Section
('gallery', 'title', 'Campus'),
('gallery', 'titleHighlight', 'Gallery'),
('gallery', 'description', 'Explore our colorful facilities and vibrant campus life! 🏫🎉')

ON DUPLICATE KEY UPDATE field_value = VALUES(field_value);

-- Insert Default Gallery Images (with image_type column)
INSERT INTO gallery_images (title, category, emoji, image_path, image_type, display_order) VALUES
('Educational Trip', 'Activities', '🎒', '/gallery-field-trip-1.jpeg', 'upload', 1),
('Student Achievement', 'Awards', '🏆', '/gallery-achievement.jpeg', 'upload', 2),
('Happy Students', 'Activities', '😊', '/gallery-students-1.jpeg', 'upload', 3),
('Outdoor Learning', 'Activities', '🌳', '/gallery-field-trip-2.jpeg', 'upload', 4),
('Our Bright Stars', 'Students', '⭐', '/gallery-students-2.jpeg', 'upload', 5)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insert Sample Landing Notices
INSERT INTO landing_notices (title, content, notice_type, is_important, start_date, end_date) VALUES
('Admissions Open 2026-27', 'Admissions are now open for the academic year 2026-27. Apply now!', 'general', TRUE, '2026-01-01', '2026-03-31'),
('Annual Sports Day', 'Annual Sports Day will be held on February 15, 2026', 'event', FALSE, '2026-02-15', '2026-02-15'),
('Winter Vacation', 'School will remain closed from Dec 25 to Jan 5', 'holiday', FALSE, '2025-12-25', '2026-01-05')
ON DUPLICATE KEY UPDATE title = VALUES(title);

