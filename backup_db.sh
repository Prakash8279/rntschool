#!/bin/bash

# ==============================================================================
# RNT School Management System - Automated Database Backup Script
# Can be scheduled via cron: (e.g. 0 2 * * * /path/to/backup_db.sh)
# ==============================================================================

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/school_db_backup_${TIMESTAMP}.sql.gz"

mkdir -p ${BACKUP_DIR}

echo "💾 Starting database backup..."

# Read credentials from .env if present
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

DB_CONTAINER="rntschool_db"
DB_NAME="${DB_NAME:-school}"
DB_USER="root"
DB_PASS="${DB_ROOT_PASSWORD:-rootpassword}"

# Dump and gzip directly from the running container
sudo docker exec ${DB_CONTAINER} /usr/bin/mysqldump -u${DB_USER} -p${DB_PASS} ${DB_NAME} | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: ${BACKUP_FILE}"
    # Keep only the last 14 days of backups
    find ${BACKUP_DIR} -name "school_db_backup_*.sql.gz" -mtime +14 -delete
    echo "🧹 Old backups older than 14 days cleaned up."
else
    echo "❌ Backup failed!"
fi
