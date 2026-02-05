-- =====================================================
-- PERFORMANCE OPTIMIZATION: DATABASE INDEXES
-- Add indexes to improve query performance
-- Time Complexity: O(log n) instead of O(n)
-- =====================================================

USE school;

-- =====================================================
-- 1. FEE COLLECTIONS TABLE INDEXES
-- =====================================================
-- Composite index for common fee history queries
CREATE INDEX IF NOT EXISTS idx_fee_collections_lookup 
ON fee_collections(admission_no, payment_date DESC);

-- Index for year/month filtering
CREATE INDEX IF NOT EXISTS idx_fee_collections_period 
ON fee_collections(year, month, classname);

-- Index for payment mode filtering
CREATE INDEX IF NOT EXISTS idx_fee_collections_mode 
ON fee_collections(payment_mode, payment_date);

-- =====================================================
-- 2. STUDENTS TABLE INDEXES
-- =====================================================
-- Composite index for student search (name + admission)
CREATE INDEX IF NOT EXISTS idx_students_search 
ON students(student_name, admission_no);

-- Index for class-based queries
CREATE INDEX IF NOT EXISTS idx_students_class 
ON students(classname, roll_no);

-- Index for bus assignments
CREATE INDEX IF NOT EXISTS idx_students_bus 
ON students(uses_bus, bus_start_date);

-- =====================================================
-- 3. EXAM RESULTS TABLE INDEXES
-- =====================================================
-- Unique composite index for result lookups (prevents duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS idx_results_unique 
ON exam_results(admission_no, exam_name, subject);

-- Index for class/exam filtering
CREATE INDEX IF NOT EXISTS idx_results_class_exam 
ON exam_results(classname, exam_name, academic_year);

-- =====================================================
-- 4. ATTENDANCE TABLE INDEXES
-- =====================================================
-- Composite index for attendance lookups
CREATE INDEX IF NOT EXISTS idx_attendance_lookup 
ON attendance(date DESC, classname, subject);

-- =====================================================
-- 5. BUS ROUTES AND ASSIGNMENTS
-- =====================================================
-- Index for bus student assignments
CREATE INDEX IF NOT EXISTS idx_bus_assignments_student 
ON bus_student_assignments(admission_no, is_active, assigned_date);

-- Index for bus route lookups
CREATE INDEX IF NOT EXISTS idx_bus_routes_name 
ON bus_routes(bus_name, route_number);

-- =====================================================
-- 6. FEE STRUCTURE TABLE INDEXES
-- =====================================================
-- Index for class-based fee structure lookups
CREATE INDEX IF NOT EXISTS idx_fee_structure_class 
ON fee_structure(classname);

-- =====================================================
-- 7. TEACHERS AND STAFF INDEXES
-- =====================================================
-- Index for email-based lookups (login)
CREATE INDEX IF NOT EXISTS idx_teachers_email 
ON teachers(email);

CREATE INDEX IF NOT EXISTS idx_staff_email 
ON staff(email);

-- =====================================================
-- 8. NOTICES TABLE INDEXES
-- =====================================================
-- Index for date-based notice queries
CREATE INDEX IF NOT EXISTS idx_notices_date 
ON notices(date DESC, target_audience);

-- =====================================================
-- 9. TIMETABLE TABLE INDEXES
-- =====================================================
-- Index for timetable queries
CREATE INDEX IF NOT EXISTS idx_timetable_class_day 
ON timetable(classname, day);

-- =====================================================
-- 10. EXPENSES TABLE INDEXES
-- =====================================================
-- Index for expense date range queries
CREATE INDEX IF NOT EXISTS idx_expenses_date 
ON expenses(date DESC, category);

-- =====================================================
-- ANALYZE TABLES FOR STATISTICS UPDATE
-- =====================================================
ANALYZE TABLE fee_collections;
ANALYZE TABLE students;
ANALYZE TABLE exam_results;
ANALYZE TABLE attendance;
ANALYZE TABLE bus_student_assignments;
ANALYZE TABLE teachers;
ANALYZE TABLE staff;

-- =====================================================
-- SHOW INDEX CREATION RESULTS
-- =====================================================
SELECT 'Performance indexes created successfully!' as status;
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    CARDINALITY
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'school' 
    AND TABLE_NAME IN ('fee_collections', 'students', 'exam_results', 'attendance')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
