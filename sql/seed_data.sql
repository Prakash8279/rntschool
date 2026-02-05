-- =====================================================
-- SEED DATA FOR TESTING
-- Run this after school_database.sql
-- =====================================================

USE school;

-- =====================================================
-- SAMPLE STUDENTS (10 students)
-- =====================================================
INSERT INTO students (admission_no, roll_no, student_name, classname, address, contact_no, gender, dob, age, email, registration_fees, uses_bus, father_name, mother_name) VALUES
('2026001', '01', 'Aryan Sharma', 'Seven', 'A-12, Model Town', '9876543001', 'Male', '2012-05-15', 13, 'aryan@test.com', 8000, TRUE, 'Rakesh Sharma', 'Sunita Sharma'),
('2026002', '02', 'Priya Singh', 'Seven', 'B-45, Green Park', '9876543002', 'Female', '2012-08-20', 13, 'priya@test.com', 8000, FALSE, 'Ajay Singh', 'Kavita Singh'),
('2026003', '03', 'Rahul Verma', 'Six', 'C-78, Civil Lines', '9876543003', 'Male', '2013-03-10', 12, 'rahul@test.com', 8000, TRUE, 'Sunil Verma', 'Anita Verma'),
('2026004', '04', 'Sneha Gupta', 'Six', 'D-23, Rajendra Nagar', '9876543004', 'Female', '2013-07-25', 12, 'sneha@test.com', 8000, FALSE, 'Vinod Gupta', 'Meena Gupta'),
('2026005', '05', 'Amit Kumar', 'Five', 'E-56, Ashok Vihar', '9876543005', 'Male', '2014-01-18', 11, 'amit@test.com', 7000, TRUE, 'Ramesh Kumar', 'Suman Kumar'),
('2026006', '06', 'Neha Patel', 'Five', 'F-89, Pitampura', '9876543006', 'Female', '2014-04-30', 11, 'neha@test.com', 7000, FALSE, 'Mahesh Patel', 'Rekha Patel'),
('2026007', '07', 'Vikram Yadav', 'Four', 'G-12, Rohini', '9876543007', 'Male', '2015-09-12', 10, 'vikram@test.com', 7000, TRUE, 'Deepak Yadav', 'Geeta Yadav'),
('2026008', '08', 'Anjali Joshi', 'Three', 'H-34, Janakpuri', '9876543008', 'Female', '2016-11-05', 9, 'anjali@test.com', 6000, FALSE, 'Prakash Joshi', 'Shanti Joshi'),
('2026009', '09', 'Kunal Mehta', 'Two', 'I-67, Dwarka', '9876543009', 'Male', '2017-02-28', 8, 'kunal@test.com', 6000, TRUE, 'Anil Mehta', 'Pooja Mehta'),
('2026010', '10', 'Riya Agarwal', 'One', 'J-90, Vasant Kunj', '9876543010', 'Female', '2018-06-14', 7, 'riya@test.com', 6000, FALSE, 'Sanjay Agarwal', 'Nisha Agarwal');

-- =====================================================
-- SAMPLE TEACHERS (5 teachers)
-- =====================================================
INSERT INTO teachers (teacher_name, email, contact_no, gender, qualification, subjects_to_teach, class_teacher_of, estimated_salary, joining_date, dob, age) VALUES
('Dr. Ramesh Chandra', 'ramesh@school.com', '9988776601', 'Male', 'M.Sc., B.Ed', '["Mathematics", "Science"]', 'Seven', 35000, '2020-04-01', '1980-03-15', 45),
('Mrs. Sunita Devi', 'sunita@school.com', '9988776602', 'Female', 'M.A., B.Ed', '["Hindi", "Social Science"]', 'Six', 32000, '2019-07-15', '1985-08-20', 40),
('Mr. Arun Tiwari', 'arun@school.com', '9988776603', 'Male', 'B.Tech, B.Ed', '["Computer", "Mathematics"]', 'Five', 30000, '2021-01-10', '1990-01-10', 35),
('Ms. Priya Kapoor', 'priyak@school.com', '9988776604', 'Female', 'M.A. English', '["English"]', 'Four', 28000, '2022-04-01', '1992-05-25', 33),
('Mr. Vikas Sharma', 'vikas@school.com', '9988776605', 'Male', 'B.Sc., B.Ed', '["Science", "Environmental Studies"]', 'Three', 26000, '2023-06-01', '1995-09-12', 30);

-- =====================================================
-- SAMPLE STAFF (3 staff)
-- =====================================================
INSERT INTO staff (staff_name, email, contact_no, gender, work_role, salary, joining_date, dob, age) VALUES
('Mohan Lal', 'mohan@school.com', '9977665501', 'Male', 'Peon', 12000, '2018-01-01', '1975-04-10', 50),
('Kamla Devi', 'kamla@school.com', '9977665502', 'Female', 'Cleaner', 10000, '2019-03-15', '1980-07-20', 45),
('Raju Singh', 'raju@school.com', '9977665503', 'Male', 'Security Guard', 15000, '2020-05-01', '1985-11-30', 40);

-- =====================================================
-- SAMPLE NOTICES (3 notices)
-- =====================================================
INSERT INTO notices (title, content, target_audience, posted_by, is_important, date) VALUES
('Winter Vacation Announcement', 'School will remain closed from 25th Dec to 5th Jan for winter vacation.', 'all', 'Admin', TRUE, '2026-01-15 10:00:00'),
('Parent-Teacher Meeting', 'PTM scheduled for 28th January 2026. All parents are requested to attend.', 'all', 'Admin', TRUE, '2026-01-20 09:00:00'),
('Sports Day Preparation', 'Annual sports day will be held on 15th February. Practice starts from 1st Feb.', 'students', 'Admin', FALSE, '2026-01-22 11:00:00');

-- =====================================================
-- SAMPLE EXPENSES (5 expenses)
-- =====================================================
INSERT INTO expenses (title, amount, category, description, date) VALUES
('Electricity Bill - January', 15000, 'Utilities', 'Monthly electricity bill', '2026-01-05'),
('Stationery Purchase', 8500, 'Supplies', 'Notebooks, pens, and markers for office', '2026-01-10'),
('Furniture Repair', 12000, 'Maintenance', 'Classroom benches and chairs repair', '2026-01-12'),
('Water Cooler Service', 3000, 'Maintenance', 'Annual maintenance of water coolers', '2026-01-15'),
('Printer Ink Cartridges', 4500, 'Supplies', 'Ink cartridges for office printers', '2026-01-18');

-- =====================================================
-- END OF SEED DATA
-- =====================================================
