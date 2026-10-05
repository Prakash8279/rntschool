-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: school
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admit_card_access`
--

DROP TABLE IF EXISTS `admit_card_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admit_card_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `is_allowed` tinyint(1) DEFAULT 0,
  `allowed_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_admission` (`admission_no`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admit_card_access`
--

LOCK TABLES `admit_card_access` WRITE;
/*!40000 ALTER TABLE `admit_card_access` DISABLE KEYS */;
INSERT INTO `admit_card_access` VALUES (1,'2026006',1,'2026-02-15 10:39:06','2026-02-15 10:39:06'),(2,'2026001',1,'2026-02-15 10:39:12','2026-02-15 10:39:12'),(3,'admin@school.com',1,'2026-02-19 01:01:58','2026-02-18 19:31:55');
/*!40000 ALTER TABLE `admit_card_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_submissions`
--

DROP TABLE IF EXISTS `assignment_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `classname` varchar(20) DEFAULT NULL,
  `submission_text` text DEFAULT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `is_graded` tinyint(1) DEFAULT 0,
  `graded_by` varchar(100) DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_submission` (`assignment_id`,`admission_no`),
  KEY `idx_assignment` (`assignment_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_submissions`
--

LOCK TABLES `assignment_submissions` WRITE;
/*!40000 ALTER TABLE `assignment_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `classname` varchar(20) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `teacher_name` varchar(100) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `max_marks` decimal(5,2) DEFAULT 100.00,
  `attachment_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_class` (`classname`),
  KEY `idx_teacher` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,'dfg','dfghj','1st','Computer',1,'Admin','2026-05-12',100.00,NULL,1,'2026-02-18 19:18:19','2026-02-18 19:18:19');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `classname` varchar(20) NOT NULL,
  `subject` varchar(50) DEFAULT NULL,
  `student_records` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_date_class` (`date`,`classname`),
  KEY `idx_attendance_lookup` (`date`,`classname`,`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_fee_config`
--

DROP TABLE IF EXISTS `bus_fee_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bus_fee_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_bus_fee_enabled` tinyint(1) DEFAULT 1,
  `applicable_from_month` varchar(20) DEFAULT 'April',
  `applicable_from_year` int(11) DEFAULT NULL,
  `removable_from_month` varchar(20) DEFAULT NULL,
  `removable_from_year` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_fee_config`
--

LOCK TABLES `bus_fee_config` WRITE;
/*!40000 ALTER TABLE `bus_fee_config` DISABLE KEYS */;
INSERT INTO `bus_fee_config` VALUES (1,1,'April',2026,NULL,NULL,'2026-01-27 10:13:07','2026-01-27 10:13:07');
/*!40000 ALTER TABLE `bus_fee_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_routes`
--

DROP TABLE IF EXISTS `bus_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bus_routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bus_name` varchar(100) NOT NULL,
  `route_number` varchar(20) DEFAULT NULL,
  `driver_name` varchar(100) DEFAULT NULL,
  `driver_contact` varchar(15) DEFAULT NULL,
  `capacity` int(11) DEFAULT 50,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `route_number` (`route_number`),
  KEY `idx_bus_routes_name` (`bus_name`,`route_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_routes`
--

LOCK TABLES `bus_routes` WRITE;
/*!40000 ALTER TABLE `bus_routes` DISABLE KEYS */;
INSERT INTO `bus_routes` VALUES (1,'Route A - North','A-101','Rajesh Kumar','9876543210',45,'North side pick-up route','2026-01-27 10:13:07','2026-01-27 10:13:07'),(2,'Route B - South','B-102','Priya Sharma','9876543211',50,'South side pick-up route','2026-01-27 10:13:07','2026-01-27 10:13:07'),(3,'Route C - East','C-103','Vikram Singh','9876543212',48,'East side pick-up route','2026-01-27 10:13:07','2026-01-27 10:13:07'),(4,'Route D - West','D-104','Anjali Verma','9876543213',50,'West side pick-up route','2026-01-27 10:13:07','2026-01-27 10:13:07');
/*!40000 ALTER TABLE `bus_routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_student_assignments`
--

DROP TABLE IF EXISTS `bus_student_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bus_student_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `classname` varchar(20) DEFAULT NULL,
  `bus_route_id` int(11) NOT NULL,
  `pickup_point` varchar(200) DEFAULT NULL,
  `pickup_time` time DEFAULT NULL,
  `drop_time` time DEFAULT NULL,
  `assigned_date` date DEFAULT NULL,
  `removed_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_bus_route` (`bus_route_id`),
  KEY `idx_bus_assignments_student` (`admission_no`,`is_active`,`assigned_date`),
  CONSTRAINT `bus_student_assignments_ibfk_1` FOREIGN KEY (`bus_route_id`) REFERENCES `bus_routes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_student_assignments`
--

LOCK TABLES `bus_student_assignments` WRITE;
/*!40000 ALTER TABLE `bus_student_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `bus_student_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_promotion_history`
--

DROP TABLE IF EXISTS `class_promotion_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class_promotion_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `student_name` varchar(200) DEFAULT NULL,
  `from_class` varchar(50) NOT NULL,
  `to_class` varchar(50) NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `dues_at_promotion` decimal(10,2) DEFAULT 0.00,
  `promoted_by` varchar(100) DEFAULT NULL,
  `promoted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_admission` (`admission_no`),
  KEY `idx_academic_year` (`academic_year`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_promotion_history`
--

LOCK TABLES `class_promotion_history` WRITE;
/*!40000 ALTER TABLE `class_promotion_history` DISABLE KEYS */;
INSERT INTO `class_promotion_history` VALUES (1,'2026-001','prakash kumar','LKG','UKG','2025-2026',0.00,'Admin','2026-03-28 18:44:47',''),(2,'2026-001','prakash kumar','UKG','One','2025-2026',0.00,'Admin','2026-03-28 19:09:06',''),(3,'2026-001','prakash kumar','UKG','One','2025-2026',0.00,'Admin','2026-03-28 19:09:35',''),(4,'2026003','Rahul Verma','Six','Seven','2025-2026',17600.00,'Admin','2026-03-28 20:07:58','');
/*!40000 ALTER TABLE `class_promotion_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_results`
--

DROP TABLE IF EXISTS `exam_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(100) NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `classname` varchar(20) NOT NULL,
  `exam_name` varchar(100) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `total_marks` decimal(5,2) DEFAULT 100.00,
  `grade` varchar(5) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_results_unique` (`admission_no`,`exam_name`,`subject`),
  UNIQUE KEY `uq_result` (`admission_no`,`classname`,`exam_name`,`subject`),
  KEY `idx_student_exam` (`admission_no`,`exam_name`),
  KEY `idx_class_exam` (`classname`,`exam_name`),
  KEY `idx_results_class_exam` (`classname`,`exam_name`,`academic_year`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_results`
--

LOCK TABLES `exam_results` WRITE;
/*!40000 ALTER TABLE `exam_results` DISABLE KEYS */;
INSERT INTO `exam_results` VALUES (1,'prakash kumar','2026110','LKG','Unit Test 1','math',0.00,100.00,'Fail',NULL,'2026','2026-02-05 09:00:46'),(2,'prakash kumar','2026110','LKG','Unit Test 1','hindi',0.00,100.00,'Fail',NULL,'2026','2026-02-05 09:00:46'),(3,'prakash kumar','2026110','LKG','Unit Test 1','eng',0.00,100.00,'Fail',NULL,'2026','2026-02-05 09:00:46'),(4,'prakash kumar','2026110','LKG','Final Term','math',20.00,100.00,'Fail',NULL,'2026','2026-02-05 09:04:38'),(5,'prakash kumar','2026110','LKG','Final Term','hindi',100.00,100.00,'First',NULL,'2026','2026-02-05 09:04:38'),(6,'prakash kumar','2026110','LKG','Final Term','eng',150.00,100.00,'First',NULL,'2026','2026-02-05 09:04:38'),(10,'Aryan Sharma','2026001','Seven','Final Term','math',50.00,100.00,'Third',NULL,'2026','2026-02-05 09:15:12'),(11,'Aryan Sharma','2026001','Seven','Final Term','hindi',60.00,100.00,'Third',NULL,'2026','2026-02-05 09:15:12'),(12,'Aryan Sharma','2026001','Seven','Final Term','bio',45.00,100.00,'Fail',NULL,'2026','2026-02-05 09:15:12'),(13,'Priya Singh','2026002','Seven','Final Term','math',50.00,100.00,'Third',NULL,'2026','2026-02-05 09:15:12'),(14,'Priya Singh','2026002','Seven','Final Term','hindi',60.00,100.00,'Third',NULL,'2026','2026-02-05 09:15:12'),(15,'Priya Singh','2026002','Seven','Final Term','bio',45.00,100.00,'Fail',NULL,'2026','2026-02-05 09:15:12'),(19,'prakash kumar','2026118','LKG','Final Term','math',40.00,100.00,'Fail',NULL,'2026','2026-02-18 20:47:21'),(20,'prakash kumar','2026118','LKG','Final Term','hindi',50.00,100.00,'Third',NULL,'2026','2026-02-18 20:47:21'),(21,'prakash kumar','2026118','LKG','Final Term','eng',70.00,100.00,'First',NULL,'2026','2026-02-18 20:47:21'),(22,'prakash kumar','2026118','LKG','Mid Term','math',15.00,100.00,'Fail',NULL,'2026','2026-02-18 20:48:25'),(23,'prakash kumar','2026118','LKG','Mid Term','hindi',40.00,100.00,'Fail',NULL,'2026','2026-02-18 20:48:25'),(24,'prakash kumar','2026118','LKG','Mid Term','eng',70.00,100.00,'First',NULL,'2026','2026-02-18 20:48:25');
/*!40000 ALTER TABLE `exam_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_schedules`
--

DROP TABLE IF EXISTS `exam_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_name` varchar(100) NOT NULL,
  `exam_date` date DEFAULT NULL,
  `classname` varchar(20) NOT NULL,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `allow_download` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_exam` (`classname`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_schedules`
--

LOCK TABLES `exam_schedules` WRITE;
/*!40000 ALTER TABLE `exam_schedules` DISABLE KEYS */;
INSERT INTO `exam_schedules` VALUES (1,'mid sem exam','2026-02-11','Seven','[{\"subject\":\"math\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hindi\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"bio\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 06:52:24','2026-02-05 07:35:25'),(2,'end sem','2026-02-12','Four','[{\"subject\":\"math\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hindi\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"bio\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:37:08','2026-02-05 07:44:30'),(3,'end sem','2006-02-12','LKG','[{\"subject\":\"math\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hindi\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"eng\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:48:58','2026-02-05 07:48:58'),(4,'end sem','2006-02-11','Eight','[{\"subject\":\"math\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hind\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"eng\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:59:16','2026-02-05 07:59:16'),(5,'end sem','2006-02-11','Five','[{\"subject\":\"math\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hind\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"eng\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:59:24','2026-02-05 07:59:24'),(6,'end sem','2006-02-11','One','[{\"subject\":\"math\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hind\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"eng\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:59:35','2026-02-05 07:59:35'),(7,'end sem','2006-02-11','Six','[{\"subject\":\"ma\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hind\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"eng\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:59:43','2026-02-05 07:59:43'),(8,'end sem','2006-02-11','Three','[{\"subject\":\"ma\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hi\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"eng\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:59:52','2026-02-05 07:59:52'),(9,'end sem','2006-02-11','Two','[{\"subject\":\"ma\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"hi\",\"date\":\"2026-02-12\",\"time\":\"02:00\",\"duration\":\"2 hours\"},{\"subject\":\"en\",\"date\":\"2026-02-13\",\"time\":\"02:00\",\"duration\":\"2 hours\"}]',0,'2026-02-05 07:59:59','2026-02-05 07:59:59');
/*!40000 ALTER TABLE `exam_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  `date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_date` (`expense_date`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_expenses_date` (`date`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_advances`
--

DROP TABLE IF EXISTS `fee_advances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_advances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_mode` varchar(50) DEFAULT 'Cash',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_admission_no` (`admission_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_advances`
--

LOCK TABLES `fee_advances` WRITE;
/*!40000 ALTER TABLE `fee_advances` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_advances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_collections`
--

DROP TABLE IF EXISTS `fee_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `classname` varchar(20) DEFAULT NULL,
  `roll_no` varchar(20) DEFAULT NULL,
  `month` varchar(20) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `monthly_fees` decimal(10,2) DEFAULT 0.00,
  `exam_fees` decimal(10,2) DEFAULT 0.00,
  `annual_fee` decimal(10,2) DEFAULT 0.00,
  `other_fee` decimal(10,2) DEFAULT 0.00,
  `bus_fee` decimal(10,2) DEFAULT 0.00,
  `dress_fee` decimal(10,2) DEFAULT 0.00,
  `book_fee` decimal(10,2) DEFAULT 0.00,
  `fine` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `scholarship` decimal(10,2) DEFAULT 0.00,
  `is_partial` tinyint(1) DEFAULT 0,
  `payment_type` enum('full','partial','advance') DEFAULT 'full',
  `payment_status` enum('Payable','Paid','Partial','Pending') DEFAULT 'Payable',
  `academic_year` varchar(10) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `payment_mode` enum('Cash','Online','Cheque','Bank Transfer') DEFAULT 'Cash',
  `receipt_no` varchar(50) DEFAULT NULL,
  `uses_bus` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_collections`
--

LOCK TABLES `fee_collections` WRITE;
/*!40000 ALTER TABLE `fee_collections` DISABLE KEYS */;
INSERT INTO `fee_collections` VALUES (3,'2026005','Amit Kumar','Five','05','January','2026',1500.00,0.00,0.00,0.00,1000.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,2300.00,'2026-02-21 12:40:25','','Cash','RNT-20260221-0003',1,'2026-02-21 07:10:25'),(4,'2026005','Amit Kumar','Five','05','February','2026',1500.00,0.00,0.00,0.00,1000.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,2900.00,'2026-02-21 12:41:22','','Cash','RNT-20260221-0004',1,'2026-02-21 07:11:22'),(5,'2026118','prakash kumar','LKG','01','Miscellaneous','2026',0.00,0.00,1000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,700.00,'2026-02-21 12:45:04','','Cash','RNT-20260221-0005',0,'2026-02-21 07:15:04'),(6,'2026118','prakash kumar','LKG','01','February','2026',1000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,1700.00,'2026-02-21 12:46:14','','Cash','RNT-20260221-0006',0,'2026-02-21 07:16:14'),(7,'2026005','Amit Kumar','Five','05','Miscellaneous','2026',0.00,0.00,2000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,1500.00,'2026-02-21 13:46:13','','Cash','RNT-20260221-0007',1,'2026-02-21 08:16:13'),(8,'2026118','prakash kumar','LKG','01','Miscellaneous','2026',0.00,700.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,300.00,'2026-02-21 21:38:41','','Cash','RNT-20260221-0008',0,'2026-02-21 16:08:41'),(9,'2026-001','prakash kumar','LKG','02','February','2026',1000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'full','Payable',NULL,1000.00,'2026-02-23 00:08:20','','Cash','RNT-20260222-0009',0,'2026-02-22 18:38:20');
/*!40000 ALTER TABLE `fee_collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_dues`
--

DROP TABLE IF EXISTS `fee_dues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_dues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `due_amount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_admission_no` (`admission_no`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_dues`
--

LOCK TABLES `fee_dues` WRITE;
/*!40000 ALTER TABLE `fee_dues` DISABLE KEYS */;
INSERT INTO `fee_dues` VALUES (3,'2026005',300),(5,'2026118',0),(9,'2026-001',0),(10,'2026003',17600);
/*!40000 ALTER TABLE `fee_dues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_installment_payments`
--

DROP TABLE IF EXISTS `fee_installment_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_installment_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `installment_plan_id` int(11) NOT NULL,
  `installment_number` int(11) NOT NULL,
  `due_date` date DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT 0.00,
  `payment_date` datetime DEFAULT NULL,
  `status` enum('pending','paid','overdue') DEFAULT 'pending',
  `receipt_no` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_plan` (`installment_plan_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fee_installment_payments_ibfk_1` FOREIGN KEY (`installment_plan_id`) REFERENCES `fee_installments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_installment_payments`
--

LOCK TABLES `fee_installment_payments` WRITE;
/*!40000 ALTER TABLE `fee_installment_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_installment_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_installments`
--

DROP TABLE IF EXISTS `fee_installments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_installments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `num_installments` int(11) NOT NULL,
  `installment_amount` decimal(10,2) NOT NULL,
  `fee_type` varchar(50) NOT NULL,
  `start_date` date DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_admission` (`admission_no`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_installments`
--

LOCK TABLES `fee_installments` WRITE;
/*!40000 ALTER TABLE `fee_installments` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_installments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_ledger`
--

DROP TABLE IF EXISTS `fee_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_ledger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `month` varchar(20) NOT NULL,
  `year` varchar(10) NOT NULL,
  `expected_amount` decimal(10,2) DEFAULT 0.00,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('pending','partial','paid','waived') DEFAULT 'pending',
  `last_payment_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fee_month` (`admission_no`,`month`,`year`),
  KEY `idx_admission` (`admission_no`),
  KEY `idx_status` (`payment_status`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_ledger`
--

LOCK TABLES `fee_ledger` WRITE;
/*!40000 ALTER TABLE `fee_ledger` DISABLE KEYS */;
INSERT INTO `fee_ledger` VALUES (3,'2026005','January','2026',0.00,2300.00,'','2026-02-21 12:40:25','2026-02-21 07:10:25','2026-02-21 07:10:25'),(4,'2026005','February','2026',0.00,2900.00,'','2026-02-21 12:41:24','2026-02-21 07:11:24','2026-02-21 07:11:24'),(5,'2026118','Miscellaneous','2026',0.00,1000.00,'','2026-02-21 21:38:41','2026-02-21 07:15:04','2026-02-21 16:08:41'),(6,'2026118','February','2026',0.00,1700.00,'','2026-02-21 12:46:14','2026-02-21 07:16:14','2026-02-21 07:16:14'),(7,'2026005','Miscellaneous','2026',0.00,1500.00,'','2026-02-21 13:46:13','2026-02-21 08:16:13','2026-02-21 08:16:13'),(9,'2026-001','February','2026',0.00,1000.00,'','2026-02-23 00:08:20','2026-02-22 18:38:20','2026-02-22 18:38:20');
/*!40000 ALTER TABLE `fee_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_structure`
--

DROP TABLE IF EXISTS `fee_structure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_structure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(20) NOT NULL,
  `admission_fee` decimal(10,2) DEFAULT 0.00,
  `monthly_fee` decimal(10,2) DEFAULT 0.00,
  `exam_fee` decimal(10,2) DEFAULT 0.00,
  `other_fee` decimal(10,2) DEFAULT 0.00,
  `fine` decimal(10,2) DEFAULT 0.00,
  `bus_fee` decimal(10,2) DEFAULT 0.00,
  `dress_fee` decimal(10,2) DEFAULT 0.00,
  `book_fee` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `classname` (`classname`),
  KEY `idx_fee_structure_class` (`classname`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_structure`
--

LOCK TABLES `fee_structure` WRITE;
/*!40000 ALTER TABLE `fee_structure` DISABLE KEYS */;
INSERT INTO `fee_structure` VALUES (1,'Nursery',5000.00,800.00,500.00,0.00,50.00,1000.00,2000.00,1500.00,0.00,'2026-01-27 10:13:07','2026-02-04 19:20:17'),(2,'LKG',1000.00,1000.00,700.00,0.00,0.00,1000.00,2000.00,0.00,0.00,'2026-01-27 10:13:07','2026-02-21 16:08:02'),(3,'UKG',1500.00,1000.00,500.00,0.00,50.00,1000.00,2000.00,1500.00,0.00,'2026-01-27 10:13:07','2026-02-04 19:13:19'),(4,'One',6000.00,1100.00,600.00,0.00,50.00,1000.00,2500.00,2000.00,0.00,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(5,'Two',6000.00,1200.00,600.00,0.00,50.00,1000.00,2500.00,2000.00,0.00,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(6,'Three',6000.00,1300.00,600.00,0.00,50.00,1000.00,2500.00,2000.00,0.00,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(7,'Four',1000.00,1400.00,700.00,0.00,50.00,1000.00,3000.00,2500.00,0.00,'2026-01-27 10:13:07','2026-02-04 19:24:16'),(8,'Five',2000.00,1500.00,700.00,0.00,50.00,1000.00,3000.00,2500.00,0.00,'2026-01-27 10:13:07','2026-02-04 19:24:16'),(9,'Six',3000.00,1600.00,800.00,0.00,50.00,1000.00,3000.00,3000.00,0.00,'2026-01-27 10:13:07','2026-02-04 19:24:16'),(10,'Seven',4000.00,1700.00,700.00,0.00,50.00,1000.00,3000.00,3000.00,0.00,'2026-01-27 10:13:07','2026-02-04 19:24:16'),(11,'Eight',8000.00,1800.00,500.00,0.00,0.00,800.00,0.00,0.00,0.00,'2026-01-27 10:13:07','2026-02-18 18:57:01');
/*!40000 ALTER TABLE `fee_structure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_waivers`
--

DROP TABLE IF EXISTS `fee_waivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_waivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) NOT NULL,
  `waiver_type` enum('scholarship','sibling_discount','staff_ward','merit','financial_need','other') NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `applies_to` enum('all','monthly','annual','bus') DEFAULT 'all',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_admission` (`admission_no`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_waivers`
--

LOCK TABLES `fee_waivers` WRITE;
/*!40000 ALTER TABLE `fee_waivers` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_waivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_images`
--

DROP TABLE IF EXISTS `gallery_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'Activities',
  `emoji` varchar(50) DEFAULT '????',
  `image_path` varchar(500) DEFAULT NULL,
  `external_url` varchar(1000) DEFAULT NULL,
  `image_type` enum('upload','external') DEFAULT 'upload',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_images`
--

LOCK TABLES `gallery_images` WRITE;
/*!40000 ALTER TABLE `gallery_images` DISABLE KEYS */;
INSERT INTO `gallery_images` VALUES (1,'Educational Trip','Activities','????','/gallery-field-trip-1.jpeg',NULL,'upload',1,1,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(2,'Student Achievement','Awards','????','/gallery-achievement.jpeg',NULL,'upload',2,1,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(3,'Happy Students','Activities','????','/gallery-students-1.jpeg',NULL,'upload',3,1,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(4,'Outdoor Learning','Activities','????','/gallery-field-trip-2.jpeg',NULL,'upload',4,1,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(5,'Our Bright Stars','Students','???','/gallery-students-2.jpeg',NULL,'upload',5,1,'2026-01-27 10:13:07','2026-01-27 10:13:07');
/*!40000 ALTER TABLE `gallery_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_content`
--

DROP TABLE IF EXISTS `landing_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `landing_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(50) NOT NULL,
  `field_key` varchar(100) NOT NULL,
  `field_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_section_field` (`section`,`field_key`),
  UNIQUE KEY `section_field` (`section`,`field_key`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_content`
--

LOCK TABLES `landing_content` WRITE;
/*!40000 ALTER TABLE `landing_content` DISABLE KEYS */;
INSERT INTO `landing_content` VALUES (1,'home','badge','???? Nursery to 8th Grade Excellence','2026-01-27 10:13:07','2026-02-18 20:00:50'),(2,'home','title','Where Young Mind','2026-01-27 10:13:07','2026-02-18 20:00:50'),(3,'home','titleHighlight','Grow & Thrive','2026-01-27 10:13:07','2026-02-18 20:00:50'),(4,'home','subtitle','A nurturing primary school environment where children from Nursery to 8th grade develop strong foundations in academics, character, and creativity through engaging, age-appropriate learning experiences! ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(5,'home','applyButtonText','Apply Now ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(6,'home','learnMoreButtonText','Learn More ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(7,'home','stats_students_value','400+','2026-01-27 10:13:07','2026-02-18 20:00:50'),(8,'home','stats_students_label','Happy Students ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(9,'home','stats_ratio_value','30:1','2026-01-27 10:13:07','2026-02-18 20:00:50'),(10,'home','stats_ratio_label','Student-Teacher ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(11,'home','stats_years_value','10+','2026-01-27 10:13:07','2026-02-18 20:00:50'),(12,'home','stats_years_label','Years of Fun ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(13,'about','title','About Our','2026-01-27 10:13:07','2026-02-18 20:00:50'),(14,'about','titleHighlight','Primary School','2026-01-27 10:13:07','2026-02-18 20:00:50'),(15,'about','description','For over 25 years, we\'ve been nurturing young minds from Nursery to 8th grade! Our primary school creates a safe, joyful environment where children build strong academic foundations while developing confidence, creativity, and essential life skills through play-based and experiential learning. ???????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(16,'about','missionTitle','Our Mission','2026-01-27 10:13:07','2026-02-18 20:00:50'),(17,'about','missionText','To nurture curious, confident, and kind young learners by providing an engaging primary education that sparks imagination, builds strong foundations, and instills values that will guide them throughout their educational journey and beyond! ????????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(18,'contact','title','Get in','2026-01-27 10:13:07','2026-02-18 20:00:50'),(19,'contact','titleHighlight','Touch','2026-01-27 10:13:07','2026-02-18 20:00:50'),(20,'contact','description','Interested in enrolling your child? We\'d love to show you around our school and answer any questions about our Nursery to 8th grade programs! ???????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(21,'contact','phone','+917061337068','2026-01-27 10:13:07','2026-02-18 20:00:50'),(22,'contact','email','rntpublics@gmail.com','2026-01-27 10:13:07','2026-02-18 20:00:50'),(23,'contact','address','R.N.T Public School Janki Nagar','2026-01-27 10:13:07','2026-02-18 20:00:50'),(24,'contact','formTitle','Send Us a Message ????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(25,'contact','formDescription','We typically respond within 24 hours! ???','2026-01-27 10:13:07','2026-02-18 20:00:50'),(26,'gallery','title','Campus','2026-01-27 10:13:07','2026-02-18 20:00:50'),(27,'gallery','titleHighlight','Gallery','2026-01-27 10:13:07','2026-02-18 20:00:50'),(28,'gallery','description','Explore our colorful facilities and vibrant campus life! ????????','2026-01-27 10:13:07','2026-02-18 20:00:50'),(46,'about','features','[]','2026-02-18 20:00:50','2026-02-18 20:00:50');
/*!40000 ALTER TABLE `landing_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_notices`
--

DROP TABLE IF EXISTS `landing_notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `landing_notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_important` tinyint(1) DEFAULT 0,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notice_type` varchar(50) DEFAULT 'general',
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_notices`
--

LOCK TABLES `landing_notices` WRITE;
/*!40000 ALTER TABLE `landing_notices` DISABLE KEYS */;
/*!40000 ALTER TABLE `landing_notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `late_fee_config`
--

DROP TABLE IF EXISTS `late_fee_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `late_fee_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_enabled` tinyint(1) DEFAULT 0,
  `fee_type` enum('fixed','percentage','per_day') DEFAULT 'fixed',
  `fixed_amount` decimal(10,2) DEFAULT 50.00,
  `percentage` decimal(5,2) DEFAULT 5.00,
  `per_day_amount` decimal(10,2) DEFAULT 10.00,
  `grace_period_days` int(11) DEFAULT 10,
  `max_late_fee` decimal(10,2) DEFAULT 500.00,
  `due_day_of_month` int(11) DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `late_fee_config`
--

LOCK TABLES `late_fee_config` WRITE;
/*!40000 ALTER TABLE `late_fee_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `late_fee_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `target_audience` enum('all','students','teachers','staff') DEFAULT 'all',
  `posted_by` varchar(100) DEFAULT NULL,
  `is_important` tinyint(1) DEFAULT 0,
  `date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notices_date` (`date`,`target_audience`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (1,'Winter Vacation Announcement','School will remain closed from 25th Dec to 5th Jan for winter vacation.','all','Admin',1,'2026-01-15 10:00:00','2026-01-27 10:13:07'),(2,'Parent-Teacher Meeting','PTM scheduled for 28th January 2026. All parents are requested to attend.','all','Admin',1,'2026-01-20 09:00:00','2026-01-27 10:13:07'),(3,'Sports Day Preparation','Annual sports day will be held on 15th February. Practice starts from 1st Feb.','students','Admin',0,'2026-01-22 11:00:00','2026-01-27 10:13:07'),(4,'asdfgh','asdfghj','all','Admin',1,'2026-02-15 09:13:26','2026-02-15 09:13:26');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_submissions`
--

DROP TABLE IF EXISTS `quiz_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `classname` varchar(20) DEFAULT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `auto_marks` decimal(5,2) DEFAULT 0.00,
  `manual_marks` decimal(5,2) DEFAULT 0.00,
  `total_marks` decimal(5,2) DEFAULT 0.00,
  `is_graded` tinyint(1) DEFAULT 0,
  `graded_by` varchar(100) DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_quiz_submission` (`quiz_id`,`admission_no`),
  KEY `idx_quiz` (`quiz_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `quiz_submissions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_submissions`
--

LOCK TABLES `quiz_submissions` WRITE;
/*!40000 ALTER TABLE `quiz_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `classname` varchar(20) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `teacher_name` varchar(100) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT 30,
  `total_marks` decimal(5,2) DEFAULT 100.00,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_class` (`classname`),
  KEY `idx_teacher` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,'szdfgrsrtyugkj','resdtfgvhjb','1st','Hindi',1,'Admin','2026-02-15 04:40:00','2026-02-16 12:00:00',30,5.00,'[{\"id\":1,\"question\":\"fdtyyhuiiui\",\"type\":\"mcq\",\"options\":[\"yguuiijo\",\"yhgyuuh\",\"yguygu\",\"ghuyg\"],\"correct_answer\":\"ghuyg\",\"marks\":5}]',1,'2026-02-15 11:18:44','2026-02-15 11:18:44'),(2,'dfg','dfghj','7th','Science',NULL,'Admin','2026-02-19 02:51:00','2006-01-12 01:20:00',30,5.00,'[{\"id\":1,\"question\":\"dgfhj\",\"type\":\"mcq\",\"options\":[\"ghj\",\"szdfgh\",\"gfhj\",\"dhfjg\"],\"correct_answer\":\"szdfgh\",\"marks\":5}]',1,'2026-02-18 19:23:31','2026-02-18 19:23:31');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salaries`
--

DROP TABLE IF EXISTS `salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `salaries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `employee_name` varchar(100) NOT NULL,
  `role` enum('teacher','staff') NOT NULL,
  `month` varchar(20) NOT NULL,
  `year` varchar(10) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salary` (`employee_id`,`month`,`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salaries`
--

LOCK TABLES `salaries` WRITE;
/*!40000 ALTER TABLE `salaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext DEFAULT NULL,
  `setting_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'school_name','R.N.T. PUBLIC SCHOOL',NULL,NULL,'2026-01-27 10:14:07','2026-01-27 10:14:07'),(2,'school_address','Jankinagar Basantpur, Siwan (Bihar)',NULL,NULL,'2026-01-27 10:14:07','2026-01-27 10:14:07'),(3,'school_phone','+91-7061337068',NULL,NULL,'2026-01-27 10:14:07','2026-01-27 10:14:07'),(4,'school_email','rntpublics@gmail.com',NULL,NULL,'2026-01-27 10:14:07','2026-01-27 10:14:07'),(5,'academic_year','2025-2026',NULL,NULL,'2026-01-27 10:14:07','2026-01-27 10:14:07'),(6,'grading_config','{\"first\":{\"min\":70,\"max\":100},\"second\":{\"min\":75,\"max\":89},\"third\":{\"min\":50,\"max\":74},\"fail\":{\"min\":0,\"max\":49}}','json','Grading configuration for result calculation','2026-02-05 09:24:30','2026-02-18 20:35:29');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `work_role` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `contact_no` varchar(15) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `previous_school` varchar(200) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_staff_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Mohan La','mohan@school.com',NULL,NULL,NULL,'Peon','Male','9977665501',NULL,NULL,'1975-04-10',50,12000.00,NULL,'2018-01-01','2026-01-27 10:13:07','2026-02-18 20:20:13'),(2,'Kamla Devi','kamla@school.com',NULL,NULL,NULL,'Cleaner','Female','9977665502',NULL,NULL,'1980-07-20',45,10000.00,NULL,'2019-03-15','2026-01-27 10:13:07','2026-01-27 10:13:07');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `roll_no` varchar(20) DEFAULT NULL,
  `student_name` varchar(100) NOT NULL,
  `classname` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `contact_no` varchar(15) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `registration_fees` decimal(10,2) DEFAULT 0.00,
  `image` varchar(500) DEFAULT NULL,
  `uses_bus` tinyint(1) DEFAULT 0,
  `pan_no` varchar(20) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `previous_school_name` varchar(200) DEFAULT NULL,
  `alternate_mobile_no` varchar(15) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `father_aadhar_no` varchar(20) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `mother_aadhar_no` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `bus_start_date` date DEFAULT NULL,
  `bus_end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `previous_year_dues` decimal(10,2) DEFAULT 0.00,
  `promotion_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'2026001','01','Aryan Sharma','Seven','A-12, Model Town','9876543001','Male','2012-05-15','2026-01-27',13,'aryan@test.com',8000.00,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'Rakesh Sharma',NULL,'Sunita Sharma',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(2,'2026002','02','Priya Singh','Seven','B-45, Green Park','9876543002','Female','2012-08-20','2026-01-27',13,'priya@test.com',8000.00,'',1,NULL,NULL,NULL,NULL,NULL,NULL,'Ajay Singh',NULL,'Kavita Singh',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(3,'2026003','03','Rahul Verma','Seven','C-78, Civil Lines','9876543003','Male','2013-03-10','2026-01-27',12,'rahul@test.com',8000.00,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'Sunil Verma',NULL,'Anita Verma',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-03-28 20:07:58',17600.00,2026),(4,'2026004','04','Sneha Gupta','Six','D-23, Rajendra Nagar','9876543004','Female','2013-07-25','2026-01-27',12,'sneha@test.com',8000.00,'',1,NULL,NULL,NULL,NULL,NULL,NULL,'Vinod Gupta',NULL,'Meena Gupta',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(5,'2026005','05','Amit Kumar','Five','E-56, Ashok Vihar','9876543005','Male','2014-01-17','2026-01-27',11,'amit@test.com',7000.00,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'Ramesh Kumar',NULL,'Suman Kumar',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(6,'2026006','06','Neha Patel','Eight','F-89, Pitampura','9876543006','Female','2014-04-29','2026-01-27',11,'neha@test.com',7000.00,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'Mahesh Patel',NULL,'Rekha Patel',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(7,'2026007','07','Vikram Yadav','Four','G-12, Rohini','9876543007','Male','2015-09-12','2026-01-27',10,'vikram@test.com',7000.00,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'Deepak Yadav',NULL,'Geeta Yadav',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(8,'2026008','08','Anjali Joshi','Three','H-34, Janakpuri','9876543008','Female','2016-11-05','2026-01-27',9,'anjali@test.com',6000.00,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'Prakash Joshi',NULL,'Shanti Joshi',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(9,'2026009','09','Kunal Mehta','Two','I-67, Dwarka','9876543009','Male','2017-02-28','2026-01-27',8,'kunal@test.com',6000.00,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'Anil Mehta',NULL,'Pooja Mehta',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(10,'2026010','10','Riya Agarwal','One','J-90, Vasant Kunj','9876543010','Female','2018-06-14','2026-01-27',7,'riya@test.com',6000.00,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'Sanjay Agarwal',NULL,'Nisha Agarwal',NULL,NULL,NULL,NULL,'2026-01-27 04:43:07','2026-02-21 08:38:42',0.00,NULL),(11,'2026118','01','prakash kumar','LKG','Jankinagar','07323074966','Male','2005-04-12','2026-02-05',20,'prakashkumar9525090@gmail.com',500.00,'http://localhost:8000/uploads/1770277623970-Screenshot 2026-01-22 225502.png',0,'','','','','no','','','','','','$2b$10$ksRUU6.DwhS7BzMvyasACu/xVZ/R2BZKmhzdUrrAuunIO509uBQ6e',NULL,NULL,'2026-02-05 07:47:04','2026-03-28 18:27:28',0.00,NULL),(0,'2026-001','02','prakash kumar','UKG','Jankinagar','07323074966','Female','2020-04-11','2026-02-21',5,'prakashthakur7209262@gmail.com',500.00,'',0,'','','','','','','','','','','$2b$10$YwmHT4GfFlYRAbK/ZIaC9uf3g/gWIx0mEZG7yFV.zAfOOswHQd8ea',NULL,NULL,'2026-02-21 10:58:14','2026-03-28 20:04:31',0.00,2026);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class` varchar(50) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_subject` (`class`,`subject_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'LKG','English','ENG','2026-01-27 10:13:07','2026-01-27 10:13:07'),(2,'LKG','Mathematics','MATH','2026-01-27 10:13:07','2026-01-27 10:13:07'),(3,'LKG','Environmental Science','EVS','2026-01-27 10:13:07','2026-01-27 10:13:07'),(4,'LKG','Art & Craft','ART','2026-01-27 10:13:07','2026-01-27 10:13:07'),(5,'LKG','Physical Education','PE','2026-01-27 10:13:07','2026-01-27 10:13:07'),(6,'Seven','math','22','2026-02-05 06:57:20','2026-02-05 06:57:20'),(7,'Seven','phy','144','2026-02-05 06:57:28','2026-02-05 06:57:28'),(8,'Seven','bio','156','2026-02-05 06:57:34','2026-02-05 06:57:34');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `contact_no` varchar(15) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `subjects_to_teach` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `class_teacher_of` varchar(20) DEFAULT NULL,
  `previous_school` varchar(200) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `estimated_salary` decimal(10,2) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_teachers_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (3,'Mr. Arun Tiwari','arun@school.com',NULL,NULL,NULL,'Male','9988776603','B.Tech, B.Ed','[]','Five',NULL,'1990-01-02',36,30000.00,NULL,'2021-01-10','$2b$10$boO4EiHESS369dQPWreMfefvM.K98jnCE86Sn5TE6TvRm5mcWISJC','2026-01-27 10:13:07','2026-03-28 18:19:34'),(4,'Ms. Priya Kapoor','priyak@school.com',NULL,NULL,NULL,'Female','9988776604','M.A. English','[\"English\"]','Four',NULL,'1992-05-25',33,28000.00,NULL,'2022-04-01',NULL,'2026-01-27 10:13:07','2026-01-27 10:13:07'),(5,'Mr. Vikas Sharma','vikas@school.com',NULL,NULL,NULL,'Male','9988776605','B.Sc., B.Ed','[]','Three',NULL,'1995-09-12',30,2538.00,NULL,'2023-06-01',NULL,'2026-01-27 10:13:07','2026-02-18 20:20:42');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(20) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `teacher_name` varchar(100) DEFAULT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_class_day` (`classname`,`day`),
  KEY `idx_timetable_class_day` (`classname`,`day`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
INSERT INTO `timetable` VALUES (1,'LKG','Mathematics',3,'Mr. Arun Tiwari','Monday','09:00:00','10:00:00','2026-02-15 09:14:20'),(2,'Six','English',4,'Ms. Priya Kapoor','Monday','09:00:00','10:00:00','2026-02-15 09:23:13');
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('admin','finance','studentManager') NOT NULL DEFAULT 'admin',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@school.com','$2b$10$1c27jocm7sdUXoaoVSGL.OYJ8ylK.nVaqhltiCm/JQLpW/1nGd7U2','admin','https://ui-avatars.com/api/?name=Admin','2026-01-27 10:13:07','2026-03-28 19:38:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 15:06:02
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
