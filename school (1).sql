-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 01, 2026 at 06:06 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school`
--

-- --------------------------------------------------------

--
-- Table structure for table `admit_card_access`
--

CREATE TABLE `admit_card_access` (
  `id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_allowed` tinyint(1) DEFAULT '0',
  `allowed_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_id` int DEFAULT NULL,
  `teacher_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `max_marks` decimal(5,2) DEFAULT '100.00',
  `attachment_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` int NOT NULL,
  `assignment_id` int NOT NULL,
  `student_id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submission_text` text COLLATE utf8mb4_unicode_ci,
  `attachment_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `is_graded` tinyint(1) DEFAULT '0',
  `graded_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_records` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `bus_fee_config`
--

CREATE TABLE `bus_fee_config` (
  `id` int NOT NULL,
  `is_bus_fee_enabled` tinyint(1) DEFAULT '1',
  `applicable_from_month` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'April',
  `applicable_from_year` int DEFAULT NULL,
  `removable_from_month` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `removable_from_year` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_fee_config`
--

INSERT INTO `bus_fee_config` (`id`, `is_bus_fee_enabled`, `applicable_from_month`, `applicable_from_year`, `removable_from_month`, `removable_from_year`, `created_at`, `updated_at`) VALUES
(1, 1, 'April', 2026, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `bus_routes`
--

CREATE TABLE `bus_routes` (
  `id` int NOT NULL,
  `bus_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int DEFAULT '50',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_routes`
--

INSERT INTO `bus_routes` (`id`, `bus_name`, `route_number`, `driver_name`, `driver_contact`, `capacity`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Route A - North', 'A-101', 'Rajesh Kumar', '9876543210', 45, 'North side pick-up route', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'Route B - South', 'B-102', 'Priya Sharma', '9876543211', 50, 'South side pick-up route', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'Route C - East', 'C-103', 'Vikram Singh', '9876543212', 48, 'East side pick-up route', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'Route D - West', 'D-104', 'Anjali Verma', '9876543213', 50, 'West side pick-up route', '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `bus_student_assignments`
--

CREATE TABLE `bus_student_assignments` (
  `id` int NOT NULL,
  `student_id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bus_route_id` int NOT NULL,
  `pickup_point` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pickup_time` time DEFAULT NULL,
  `drop_time` time DEFAULT NULL,
  `assigned_date` date DEFAULT NULL,
  `removed_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_results`
--

CREATE TABLE `exam_results` (
  `id` int NOT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exam_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `total_marks` decimal(5,2) DEFAULT '100.00',
  `grade` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_schedules`
--

CREATE TABLE `exam_schedules` (
  `id` int NOT NULL,
  `exam_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exam_date` date DEFAULT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `allow_download` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  `date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `title`, `description`, `amount`, `category`, `expense_date`, `date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Electricity Bill - January', 'Monthly electricity bill', 15000.00, 'Utilities', NULL, '2026-01-05', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'Stationery Purchase', 'Notebooks, pens, and markers for office', 8500.00, 'Supplies', NULL, '2026-01-10', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'Furniture Repair', 'Classroom benches and chairs repair', 12000.00, 'Maintenance', NULL, '2026-01-12', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'Water Cooler Service', 'Annual maintenance of water coolers', 3000.00, 'Maintenance', NULL, '2026-01-15', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, 'Printer Ink Cartridges', 'Ink cartridges for office printers', 4500.00, 'Supplies', NULL, '2026-01-18', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `fee_collections`
--

CREATE TABLE `fee_collections` (
  `id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roll_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `month` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthly_fees` decimal(10,2) DEFAULT '0.00',
  `exam_fees` decimal(10,2) DEFAULT '0.00',
  `annual_fee` decimal(10,2) DEFAULT '0.00',
  `other_fee` decimal(10,2) DEFAULT '0.00',
  `bus_fee` decimal(10,2) DEFAULT '0.00',
  `dress_fee` decimal(10,2) DEFAULT '0.00',
  `book_fee` decimal(10,2) DEFAULT '0.00',
  `fine` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `late_fee` decimal(10,2) DEFAULT '0.00',
  `scholarship` decimal(10,2) DEFAULT '0.00',
  `is_partial` tinyint(1) DEFAULT '0',
  `payment_type` enum('full','partial','advance') COLLATE utf8mb4_unicode_ci DEFAULT 'full',
  `payment_status` enum('Payable','Paid','Partial','Pending') COLLATE utf8mb4_unicode_ci DEFAULT 'Payable',
  `academic_year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `payment_mode` enum('Cash','Online','Cheque','Bank Transfer') COLLATE utf8mb4_unicode_ci DEFAULT 'Cash',
  `receipt_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uses_bus` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_collections`
--

INSERT INTO `fee_collections` (`id`, `admission_no`, `student_name`, `classname`, `roll_no`, `month`, `year`, `monthly_fees`, `exam_fees`, `annual_fee`, `other_fee`, `bus_fee`, `dress_fee`, `book_fee`, `fine`, `discount`, `late_fee`, `scholarship`, `is_partial`, `payment_type`, `payment_status`, `academic_year`, `total_amount`, `payment_date`, `notes`, `payment_mode`, `receipt_no`, `uses_bus`, `created_at`) VALUES
(9, '2026001', 'Aryan Sharma', 'Seven', '01', 'January', '2026', 1700.00, 800.00, 0.00, 0.00, 1000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 'full', 'Payable', NULL, 6000.00, '2026-02-01 20:41:19', '', 'Cash', 'REC-20260201-0JSV', 1, '2026-02-01 15:11:19'),
(10, '2026001', 'Aryan Sharma', 'Seven', '01', 'February', '2026', 1700.00, 0.00, 0.00, 0.00, 1000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 'full', 'Payable', NULL, 0.00, '2026-02-01 20:41:19', '', 'Cash', 'REC-20260201-ZR6O', 1, '2026-02-01 15:11:19'),
(11, '2026001', 'Aryan Sharma', 'Seven', '01', 'March', '2026', 1700.00, 0.00, 0.00, 0.00, 1000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 'full', 'Payable', NULL, 2900.00, '2026-02-01 23:29:35', '', 'Cash', 'REC-20260201-5Q7L', 1, '2026-02-01 17:59:35'),
(12, '2026001', 'Aryan Sharma', 'Seven', '01', 'April', '2026', 1700.00, 0.00, 0.00, 0.00, 1000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 'full', 'Payable', NULL, 3000.00, '2026-02-01 23:30:55', '', 'Cash', 'REC-20260201-D9WC', 1, '2026-02-01 18:00:55');

-- --------------------------------------------------------

--
-- Table structure for table `fee_dues`
--

CREATE TABLE `fee_dues` (
  `id` int NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `due_amount` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_dues`
--

INSERT INTO `fee_dues` (`id`, `admission_no`, `due_amount`) VALUES
(7, '2026001', -100);

-- --------------------------------------------------------

--
-- Table structure for table `fee_installments`
--

CREATE TABLE `fee_installments` (
  `id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `num_installments` int NOT NULL,
  `installment_amount` decimal(10,2) NOT NULL,
  `fee_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `created_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_installment_payments`
--

CREATE TABLE `fee_installment_payments` (
  `id` int NOT NULL,
  `installment_plan_id` int NOT NULL,
  `installment_number` int NOT NULL,
  `due_date` date DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  `payment_date` datetime DEFAULT NULL,
  `status` enum('pending','paid','overdue') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `receipt_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_ledger`
--

CREATE TABLE `fee_ledger` (
  `id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expected_amount` decimal(10,2) DEFAULT '0.00',
  `amount_paid` decimal(10,2) DEFAULT '0.00',
  `payment_status` enum('pending','partial','paid','waived') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_payment_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure`
--

CREATE TABLE `fee_structure` (
  `id` int NOT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admission_fee` decimal(10,2) DEFAULT '0.00',
  `monthly_fee` decimal(10,2) DEFAULT '0.00',
  `annual_fee` decimal(10,2) DEFAULT '0.00',
  `exam_fee` decimal(10,2) DEFAULT '0.00',
  `other_fee` decimal(10,2) DEFAULT '0.00',
  `fine` decimal(10,2) DEFAULT '0.00',
  `bus_fee` decimal(10,2) DEFAULT '0.00',
  `dress_fee` decimal(10,2) DEFAULT '0.00',
  `book_fee` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_structure`
--

INSERT INTO `fee_structure` (`id`, `classname`, `admission_fee`, `monthly_fee`, `annual_fee`, `exam_fee`, `other_fee`, `fine`, `bus_fee`, `dress_fee`, `book_fee`, `discount`, `created_at`, `updated_at`) VALUES
(1, 'Nursery', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'LKG', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'UKG', 0.00, 1000.00, 0.00, 500.00, 0.00, 50.00, 1000.00, 2000.00, 1500.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'One', 6000.00, 1100.00, 0.00, 600.00, 0.00, 50.00, 1000.00, 2500.00, 2000.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, 'Two', 6000.00, 1200.00, 0.00, 600.00, 0.00, 50.00, 1000.00, 2500.00, 2000.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(6, 'Three', 6000.00, 1300.00, 0.00, 600.00, 0.00, 50.00, 1000.00, 2500.00, 2000.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(7, 'Four', 7000.00, 1400.00, 0.00, 700.00, 0.00, 50.00, 1000.00, 3000.00, 2500.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(8, 'Five', 7000.00, 1500.00, 0.00, 700.00, 0.00, 50.00, 1000.00, 3000.00, 2500.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(9, 'Six', 8000.00, 1600.00, 0.00, 800.00, 0.00, 50.00, 1000.00, 3000.00, 3000.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(10, 'Seven', 8000.00, 1700.00, 0.00, 800.00, 0.00, 50.00, 1000.00, 3000.00, 3000.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(11, 'Eight', 8000.00, 1800.00, 0.00, 800.00, 0.00, 50.00, 1000.00, 3000.00, 3000.00, 0.00, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `fee_waivers`
--

CREATE TABLE `fee_waivers` (
  `id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `waiver_type` enum('scholarship','sibling_discount','staff_ward','merit','financial_need','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `applies_to` enum('all','monthly','annual','bus') COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `approved_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Activities',
  `emoji` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '????',
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_url` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_type` enum('upload','external') COLLATE utf8mb4_unicode_ci DEFAULT 'upload',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `title`, `category`, `emoji`, `image_path`, `external_url`, `image_type`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Educational Trip', 'Activities', '????', '/gallery-field-trip-1.jpeg', NULL, 'upload', 1, 1, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'Student Achievement', 'Awards', '????', '/gallery-achievement.jpeg', NULL, 'upload', 2, 1, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'Happy Students', 'Activities', '????', '/gallery-students-1.jpeg', NULL, 'upload', 3, 1, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'Outdoor Learning', 'Activities', '????', '/gallery-field-trip-2.jpeg', NULL, 'upload', 4, 1, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, 'Our Bright Stars', 'Students', '???', '/gallery-students-2.jpeg', NULL, 'upload', 5, 1, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `landing_content`
--

CREATE TABLE `landing_content` (
  `id` int NOT NULL,
  `section` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `landing_content`
--

INSERT INTO `landing_content` (`id`, `section`, `field_key`, `field_value`, `created_at`, `updated_at`) VALUES
(1, 'home', 'badge', '???? Nursery to 8th Grade Excellence', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'home', 'title', 'Where Young Minds', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'home', 'titleHighlight', 'Grow & Thrive', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'home', 'subtitle', 'A nurturing primary school environment where children from Nursery to 8th grade develop strong foundations in academics, character, and creativity through engaging, age-appropriate learning experiences! ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, 'home', 'applyButtonText', 'Apply Now ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(6, 'home', 'learnMoreButtonText', 'Learn More ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(7, 'home', 'stats_students_value', '400+', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(8, 'home', 'stats_students_label', 'Happy Students ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(9, 'home', 'stats_ratio_value', '30:1', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(10, 'home', 'stats_ratio_label', 'Student-Teacher ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(11, 'home', 'stats_years_value', '10+', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(12, 'home', 'stats_years_label', 'Years of Fun ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(13, 'about', 'title', 'About Our', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(14, 'about', 'titleHighlight', 'Primary School', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(15, 'about', 'description', 'For over 25 years, we\'ve been nurturing young minds from Nursery to 8th grade! Our primary school creates a safe, joyful environment where children build strong academic foundations while developing confidence, creativity, and essential life skills through play-based and experiential learning. ???????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(16, 'about', 'missionTitle', 'Our Mission', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(17, 'about', 'missionText', 'To nurture curious, confident, and kind young learners by providing an engaging primary education that sparks imagination, builds strong foundations, and instills values that will guide them throughout their educational journey and beyond! ????????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(18, 'contact', 'title', 'Get in', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(19, 'contact', 'titleHighlight', 'Touch', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(20, 'contact', 'description', 'Interested in enrolling your child? We\'d love to show you around our school and answer any questions about our Nursery to 8th grade programs! ???????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(21, 'contact', 'phone', '+917061337068', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(22, 'contact', 'email', 'rntpublics@gmail.com', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(23, 'contact', 'address', 'R.N.T Public School Janki Nagar', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(24, 'contact', 'formTitle', 'Send Us a Message ????', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(25, 'contact', 'formDescription', 'We typically respond within 24 hours! ???', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(26, 'gallery', 'title', 'Campus', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(27, 'gallery', 'titleHighlight', 'Gallery', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(28, 'gallery', 'description', 'Explore our colorful facilities and vibrant campus life! ????????', '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `landing_notices`
--

CREATE TABLE `landing_notices` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `is_important` tinyint(1) DEFAULT '0',
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `late_fee_config`
--

CREATE TABLE `late_fee_config` (
  `id` int NOT NULL,
  `is_enabled` tinyint(1) DEFAULT '0',
  `fee_type` enum('fixed','percentage','per_day') COLLATE utf8mb4_unicode_ci DEFAULT 'fixed',
  `fixed_amount` decimal(10,2) DEFAULT '50.00',
  `percentage` decimal(5,2) DEFAULT '5.00',
  `per_day_amount` decimal(10,2) DEFAULT '10.00',
  `grace_period_days` int DEFAULT '10',
  `max_late_fee` decimal(10,2) DEFAULT '500.00',
  `due_day_of_month` int DEFAULT '10',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `late_fee_config`
--

INSERT INTO `late_fee_config` (`id`, `is_enabled`, `fee_type`, `fixed_amount`, `percentage`, `per_day_amount`, `grace_period_days`, `max_late_fee`, `due_day_of_month`, `created_at`, `updated_at`) VALUES
(1, 0, 'fixed', 50.00, 5.00, 10.00, 10, 500.00, 10, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_audience` enum('all','students','teachers','staff') COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `posted_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_important` tinyint(1) DEFAULT '0',
  `date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`id`, `title`, `content`, `target_audience`, `posted_by`, `is_important`, `date`, `created_at`) VALUES
(1, 'Winter Vacation Announcement', 'School will remain closed from 25th Dec to 5th Jan for winter vacation.', 'all', 'Admin', 1, '2026-01-15 10:00:00', '2026-01-27 10:13:07'),
(2, 'Parent-Teacher Meeting', 'PTM scheduled for 28th January 2026. All parents are requested to attend.', 'all', 'Admin', 1, '2026-01-20 09:00:00', '2026-01-27 10:13:07'),
(3, 'Sports Day Preparation', 'Annual sports day will be held on 15th February. Practice starts from 1st Feb.', 'students', 'Admin', 0, '2026-01-22 11:00:00', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_id` int DEFAULT NULL,
  `teacher_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_minutes` int DEFAULT '30',
  `total_marks` decimal(5,2) DEFAULT '100.00',
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_submissions`
--

CREATE TABLE `quiz_submissions` (
  `id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `student_id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `started_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `auto_marks` decimal(5,2) DEFAULT '0.00',
  `manual_marks` decimal(5,2) DEFAULT '0.00',
  `total_marks` decimal(5,2) DEFAULT '0.00',
  `is_graded` tinyint(1) DEFAULT '0',
  `graded_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `employee_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('teacher','staff') COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` longtext COLLATE utf8mb4_unicode_ci,
  `setting_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `created_at`, `updated_at`) VALUES
(1, 'school_name', 'R.N.T. PUBLIC SCHOOL', NULL, NULL, '2026-01-27 10:14:07', '2026-01-27 10:14:07'),
(2, 'school_address', 'Jankinagar Basantpur, Siwan (Bihar)', NULL, NULL, '2026-01-27 10:14:07', '2026-01-27 10:14:07'),
(3, 'school_phone', '+91-7061337068', NULL, NULL, '2026-01-27 10:14:07', '2026-01-27 10:14:07'),
(4, 'school_email', 'rntpublics@gmail.com', NULL, NULL, '2026-01-27 10:14:07', '2026-01-27 10:14:07'),
(5, 'academic_year', '2025-2026', NULL, NULL, '2026-01-27 10:14:07', '2026-01-27 10:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int NOT NULL,
  `staff_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhar_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `work_role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_no` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualification` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_school` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `staff_name`, `email`, `aadhar_no`, `pan_no`, `address`, `work_role`, `gender`, `contact_no`, `qualification`, `previous_school`, `dob`, `age`, `salary`, `image`, `joining_date`, `created_at`, `updated_at`) VALUES
(1, 'Mohan Lal', 'mohan@school.com', NULL, NULL, NULL, 'Peon', 'Male', '9977665501', NULL, NULL, '1975-04-10', 50, 12000.00, NULL, '2018-01-01', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'Kamla Devi', 'kamla@school.com', NULL, NULL, NULL, 'Cleaner', 'Female', '9977665502', NULL, NULL, '1980-07-20', 45, 10000.00, NULL, '2019-03-15', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'Raju Singh', 'raju@school.com', NULL, NULL, NULL, 'Security Guard', 'Male', '9977665503', NULL, NULL, '1985-11-30', 40, 15000.00, NULL, '2020-05-01', '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int NOT NULL,
  `admission_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roll_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `contact_no` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_fees` decimal(10,2) DEFAULT '0.00',
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uses_bus` tinyint(1) DEFAULT '0',
  `pan_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhar_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_school_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alternate_mobile_no` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_aadhar_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_aadhar_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bus_start_date` date DEFAULT NULL,
  `bus_end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `admission_no`, `roll_no`, `student_name`, `classname`, `address`, `contact_no`, `gender`, `dob`, `age`, `email`, `registration_fees`, `image`, `uses_bus`, `pan_no`, `weight`, `height`, `aadhar_no`, `previous_school_name`, `alternate_mobile_no`, `father_name`, `father_aadhar_no`, `mother_name`, `mother_aadhar_no`, `password_hash`, `bus_start_date`, `bus_end_date`, `created_at`, `updated_at`) VALUES
(1, '2026001', '01', 'Aryan Sharma', 'Seven', 'A-12, Model Town', '9876543001', 'Male', '2012-05-15', 13, 'aryan@test.com', 8000.00, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Rakesh Sharma', NULL, 'Sunita Sharma', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, '2026002', '02', 'Priya Singh', 'Seven', 'B-45, Green Park', '9876543002', 'Female', '2012-08-20', 13, 'priya@test.com', 8000.00, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Ajay Singh', NULL, 'Kavita Singh', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, '2026003', '03', 'Rahul Verma', 'Six', 'C-78, Civil Lines', '9876543003', 'Male', '2013-03-10', 12, 'rahul@test.com', 8000.00, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Sunil Verma', NULL, 'Anita Verma', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, '2026004', '04', 'Sneha Gupta', 'Six', 'D-23, Rajendra Nagar', '9876543004', 'Female', '2013-07-25', 12, 'sneha@test.com', 8000.00, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Vinod Gupta', NULL, 'Meena Gupta', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, '2026005', '05', 'Amit Kumar', 'Five', 'E-56, Ashok Vihar', '9876543005', 'Male', '2014-01-18', 11, 'amit@test.com', 7000.00, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Ramesh Kumar', NULL, 'Suman Kumar', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(6, '2026006', '06', 'Neha Patel', 'Five', 'F-89, Pitampura', '9876543006', 'Female', '2014-04-30', 11, 'neha@test.com', 7000.00, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Mahesh Patel', NULL, 'Rekha Patel', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(7, '2026007', '07', 'Vikram Yadav', 'Four', 'G-12, Rohini', '9876543007', 'Male', '2015-09-12', 10, 'vikram@test.com', 7000.00, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Deepak Yadav', NULL, 'Geeta Yadav', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(8, '2026008', '08', 'Anjali Joshi', 'Three', 'H-34, Janakpuri', '9876543008', 'Female', '2016-11-05', 9, 'anjali@test.com', 6000.00, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Prakash Joshi', NULL, 'Shanti Joshi', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(9, '2026009', '09', 'Kunal Mehta', 'Two', 'I-67, Dwarka', '9876543009', 'Male', '2017-02-28', 8, 'kunal@test.com', 6000.00, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Anil Mehta', NULL, 'Pooja Mehta', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(10, '2026010', '10', 'Riya Agarwal', 'One', 'J-90, Vasant Kunj', '9876543010', 'Female', '2018-06-14', 7, 'riya@test.com', 6000.00, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Sanjay Agarwal', NULL, 'Nisha Agarwal', NULL, NULL, NULL, NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int NOT NULL,
  `class` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `class`, `subject_name`, `subject_code`, `created_at`, `updated_at`) VALUES
(1, 'LKG', 'English', 'ENG', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(2, 'LKG', 'Mathematics', 'MATH', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'LKG', 'Environmental Science', 'EVS', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'LKG', 'Art & Craft', 'ART', '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, 'LKG', 'Physical Education', 'PE', '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int NOT NULL,
  `teacher_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhar_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_no` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualification` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subjects_to_teach` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `class_teacher_of` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_school` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `estimated_salary` decimal(10,2) DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `teacher_name`, `email`, `aadhar_no`, `pan_no`, `address`, `gender`, `contact_no`, `qualification`, `subjects_to_teach`, `class_teacher_of`, `previous_school`, `dob`, `age`, `estimated_salary`, `image`, `joining_date`, `password_hash`, `created_at`, `updated_at`) VALUES
(2, 'Mrs. Sunita Devi', 'sunita@school.com', NULL, NULL, NULL, 'Female', '9988776602', 'M.A., B.Ed', '[\"Hindi\", \"Social Science\"]', 'Six', NULL, '1985-08-20', 40, 32000.00, NULL, '2019-07-15', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(3, 'Mr. Arun Tiwari', 'arun@school.com', NULL, NULL, NULL, 'Male', '9988776603', 'B.Tech, B.Ed', '[\"Computer\", \"Mathematics\"]', 'Five', NULL, '1990-01-10', 35, 30000.00, NULL, '2021-01-10', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(4, 'Ms. Priya Kapoor', 'priyak@school.com', NULL, NULL, NULL, 'Female', '9988776604', 'M.A. English', '[\"English\"]', 'Four', NULL, '1992-05-25', 33, 28000.00, NULL, '2022-04-01', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07'),
(5, 'Mr. Vikas Sharma', 'vikas@school.com', NULL, NULL, NULL, 'Male', '9988776605', 'B.Sc., B.Ed', '[\"Science\", \"Environmental Studies\"]', 'Three', NULL, '1995-09-12', 30, 26000.00, NULL, '2023-06-01', NULL, '2026-01-27 10:13:07', '2026-01-27 10:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `timetable`
--

CREATE TABLE `timetable` (
  `id` int NOT NULL,
  `classname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_id` int DEFAULT NULL,
  `teacher_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','finance','studentManager') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@school.com', '$2b$10$nigwh4VfT5XwPb6sSXNua.r.sG9tA9AiWhtfQMAvTcB1bNNQoSttm', 'admin', 'https://ui-avatars.com/api/?name=Admin', '2026-01-27 10:13:07', '2026-01-27 10:13:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admit_card_access`
--
ALTER TABLE `admit_card_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_admission` (`admission_no`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`classname`),
  ADD KEY `idx_teacher` (`teacher_id`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_submission` (`assignment_id`,`admission_no`),
  ADD KEY `idx_assignment` (`assignment_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date_class` (`date`,`classname`);

--
-- Indexes for table `bus_fee_config`
--
ALTER TABLE `bus_fee_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bus_routes`
--
ALTER TABLE `bus_routes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `route_number` (`route_number`);

--
-- Indexes for table `bus_student_assignments`
--
ALTER TABLE `bus_student_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_bus_route` (`bus_route_id`);

--
-- Indexes for table `exam_results`
--
ALTER TABLE `exam_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_exam` (`admission_no`,`exam_name`),
  ADD KEY `idx_class_exam` (`classname`,`exam_name`);

--
-- Indexes for table `exam_schedules`
--
ALTER TABLE `exam_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_class_exam` (`classname`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_date` (`expense_date`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `fee_collections`
--
ALTER TABLE `fee_collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_no` (`receipt_no`),
  ADD KEY `idx_admission_no` (`admission_no`),
  ADD KEY `idx_month_year` (`month`,`year`),
  ADD KEY `idx_fee_academic_year` (`academic_year`),
  ADD KEY `idx_fee_payment_date` (`payment_date`),
  ADD KEY `idx_fee_class_year` (`classname`,`year`),
  ADD KEY `idx_payment_status` (`payment_status`);

--
-- Indexes for table `fee_dues`
--
ALTER TABLE `fee_dues`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_admission_no` (`admission_no`);

--
-- Indexes for table `fee_installments`
--
ALTER TABLE `fee_installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admission` (`admission_no`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `fee_installment_payments`
--
ALTER TABLE `fee_installment_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_plan` (`installment_plan_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `fee_ledger`
--
ALTER TABLE `fee_ledger`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fee_month` (`admission_no`,`month`,`year`),
  ADD KEY `idx_admission` (`admission_no`),
  ADD KEY `idx_status` (`payment_status`);

--
-- Indexes for table `fee_structure`
--
ALTER TABLE `fee_structure`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `classname` (`classname`);

--
-- Indexes for table `fee_waivers`
--
ALTER TABLE `fee_waivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admission` (`admission_no`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landing_content`
--
ALTER TABLE `landing_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_section_field` (`section`,`field_key`);

--
-- Indexes for table `landing_notices`
--
ALTER TABLE `landing_notices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `late_fee_config`
--
ALTER TABLE `late_fee_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`classname`),
  ADD KEY `idx_teacher` (`teacher_id`);

--
-- Indexes for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_quiz_submission` (`quiz_id`,`admission_no`),
  ADD KEY `idx_quiz` (`quiz_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_salary` (`employee_id`,`month`,`year`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_no` (`admission_no`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_class_subject` (`class`,`subject_code`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `timetable`
--
ALTER TABLE `timetable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class_day` (`classname`,`day`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admit_card_access`
--
ALTER TABLE `admit_card_access`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bus_fee_config`
--
ALTER TABLE `bus_fee_config`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bus_routes`
--
ALTER TABLE `bus_routes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bus_student_assignments`
--
ALTER TABLE `bus_student_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_results`
--
ALTER TABLE `exam_results`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_schedules`
--
ALTER TABLE `exam_schedules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fee_collections`
--
ALTER TABLE `fee_collections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `fee_dues`
--
ALTER TABLE `fee_dues`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `fee_installments`
--
ALTER TABLE `fee_installments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fee_installment_payments`
--
ALTER TABLE `fee_installment_payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fee_ledger`
--
ALTER TABLE `fee_ledger`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fee_structure`
--
ALTER TABLE `fee_structure`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `fee_waivers`
--
ALTER TABLE `fee_waivers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `landing_content`
--
ALTER TABLE `landing_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `landing_notices`
--
ALTER TABLE `landing_notices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `late_fee_config`
--
ALTER TABLE `late_fee_config`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timetable`
--
ALTER TABLE `timetable`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bus_student_assignments`
--
ALTER TABLE `bus_student_assignments`
  ADD CONSTRAINT `bus_student_assignments_ibfk_1` FOREIGN KEY (`bus_route_id`) REFERENCES `bus_routes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fee_installment_payments`
--
ALTER TABLE `fee_installment_payments`
  ADD CONSTRAINT `fee_installment_payments_ibfk_1` FOREIGN KEY (`installment_plan_id`) REFERENCES `fee_installments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD CONSTRAINT `quiz_submissions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
