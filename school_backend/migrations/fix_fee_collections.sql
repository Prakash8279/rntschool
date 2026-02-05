-- Migration: Add missing columns to fee_collections if they don't exist
-- Run this if you get "Unknown column" errors

-- Check current structure first:
-- DESCRIBE fee_collections;

-- These columns should exist (add if missing):
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS bus_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS dress_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS book_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS receipt_no VARCHAR(255);
ALTER TABLE fee_collections ADD COLUMN IF NOT EXISTS uses_bus TINYINT(1) DEFAULT 0;

-- Verify the table structure:
-- DESCRIBE fee_collections;
