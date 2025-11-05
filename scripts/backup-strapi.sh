#!/bin/bash

# Strapi Backup Script
# This script creates a backup of the Strapi database, uploads, and configuration
# Compatible with both Docker and Podman

set -e  # Exit on any error

# Detect container runtime (Docker or Podman)
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    CONTAINER_CMD="docker compose"
    CONTAINER_RUNTIME="docker"
elif command -v docker-compose &> /dev/null; then
    CONTAINER_CMD="docker-compose"
    CONTAINER_RUNTIME="docker"
elif command -v podman-compose &> /dev/null; then
    CONTAINER_CMD="podman-compose"
    CONTAINER_RUNTIME="podman"
elif command -v podman &> /dev/null; then
    CONTAINER_CMD="podman compose"
    CONTAINER_RUNTIME="podman"
else
    echo "WARNING: Neither Docker nor Podman found. Backup will proceed without container operations."
    CONTAINER_CMD=""
    CONTAINER_RUNTIME=""
fi

# Configuration
PROJECT_DIR=~/petstar-website
CMS_DIR=$PROJECT_DIR/petstar-cms
BACKUP_DIR=$PROJECT_DIR/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y%m%d)

# Retention settings (days)
RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
print_info "Creating backup directory..."
mkdir -p $BACKUP_DIR

# Navigate to project directory
cd $PROJECT_DIR || { print_error "Failed to navigate to $PROJECT_DIR"; exit 1; }

print_info "Starting backup at $(date)"

# Backup database
if [ -d "$CMS_DIR/database" ]; then
    print_info "Backing up database..."
    tar -czf "$BACKUP_DIR/database_$TIMESTAMP.tar.gz" -C $CMS_DIR database
    print_info "Database backed up: database_$TIMESTAMP.tar.gz"
else
    print_warning "No database directory found"
fi

# Backup SQLite .tmp directory (contains actual DB)
if [ -d "$CMS_DIR/.tmp" ]; then
    print_info "Backing up SQLite database..."
    tar -czf "$BACKUP_DIR/sqlite_$TIMESTAMP.tar.gz" -C $CMS_DIR .tmp
    print_info "SQLite backed up: sqlite_$TIMESTAMP.tar.gz"
else
    print_warning "No .tmp directory found"
fi

# Backup .env file
if [ -f "$CMS_DIR/.env" ]; then
    print_info "Backing up .env file..."
    cp "$CMS_DIR/.env" "$BACKUP_DIR/env_$TIMESTAMP"
    print_info ".env backed up: env_$TIMESTAMP"
else
    print_warning "No .env file found"
fi

# Backup public uploads directory
if [ -d "$CMS_DIR/public" ]; then
    print_info "Backing up uploaded files..."
    tar -czf "$BACKUP_DIR/public_$TIMESTAMP.tar.gz" -C $CMS_DIR public
    print_info "Uploads backed up: public_$TIMESTAMP.tar.gz"
else
    print_warning "No public directory found"
fi

# Backup config directory
if [ -d "$CMS_DIR/config" ]; then
    print_info "Backing up configuration..."
    tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" -C $CMS_DIR config
    print_info "Config backed up: config_$TIMESTAMP.tar.gz"
else
    print_warning "No config directory found"
fi

# Calculate backup sizes
print_info "Backup sizes:"
du -sh $BACKUP_DIR/*_$TIMESTAMP* 2>/dev/null | sed 's/^/  /'

# Clean up old backups
print_info "Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "*_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "env_*" -mtime +$RETENTION_DAYS -delete

REMAINING_BACKUPS=$(ls -1 $BACKUP_DIR | wc -l)
print_info "Total backups remaining: $REMAINING_BACKUPS"

# Calculate total backup directory size
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
print_info "Total backup directory size: $TOTAL_SIZE"

print_info "Backup completed successfully at $(date)"

echo ""
echo "Backup files created:"
echo "  - database_$TIMESTAMP.tar.gz"
echo "  - sqlite_$TIMESTAMP.tar.gz"
echo "  - env_$TIMESTAMP"
echo "  - public_$TIMESTAMP.tar.gz"
echo "  - config_$TIMESTAMP.tar.gz"
echo ""
echo "Location: $BACKUP_DIR"
