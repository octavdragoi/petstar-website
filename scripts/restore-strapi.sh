#!/bin/bash

# Strapi Restore Script
# This script restores a Strapi backup
# Compatible with both Docker and Podman

set -e  # Exit on any error

# Detect container runtime (Docker or Podman)
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    CONTAINER_CMD="docker compose"
    CONTAINER_EXEC="docker compose exec"
    echo "Detected: Docker with Compose plugin"
elif command -v docker-compose &> /dev/null; then
    CONTAINER_CMD="docker-compose"
    CONTAINER_EXEC="docker-compose exec"
    echo "Detected: Docker with docker-compose"
elif command -v podman-compose &> /dev/null; then
    CONTAINER_CMD="podman-compose"
    CONTAINER_EXEC="podman-compose exec"
    echo "Detected: Podman with podman-compose"
elif command -v podman &> /dev/null; then
    CONTAINER_CMD="podman compose"
    CONTAINER_EXEC="podman compose exec"
    echo "Detected: Podman with compose plugin"
else
    echo "ERROR: Neither Docker nor Podman found!"
    echo "Please install Docker or Podman to continue."
    exit 1
fi

echo "Using: $CONTAINER_CMD"
echo ""

# Configuration
PROJECT_DIR=~/petstar-website
CMS_DIR=$PROJECT_DIR/petstar-cms
DOCKER_DIR=$PROJECT_DIR/docker
BACKUP_DIR=$PROJECT_DIR/backups

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_prompt() {
    echo -e "${BLUE}[INPUT]${NC} $1"
}

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "======================================"
echo "Strapi Restore Script"
echo "======================================"
echo ""

# List available backups
print_info "Available backups:"
echo ""

# Get unique backup timestamps
TIMESTAMPS=$(ls -1 $BACKUP_DIR | grep -E "_[0-9]{8}_[0-9]{6}" | sed -E 's/.*_([0-9]{8}_[0-9]{6}).*/\1/' | sort -u)

if [ -z "$TIMESTAMPS" ]; then
    print_error "No backups found in $BACKUP_DIR"
    exit 1
fi

# Display backups with numbers
INDEX=1
declare -a TIMESTAMP_ARRAY
for TS in $TIMESTAMPS; do
    TIMESTAMP_ARRAY[$INDEX]=$TS
    # Convert timestamp to readable format
    DATE_PART=$(echo $TS | cut -d_ -f1)
    TIME_PART=$(echo $TS | cut -d_ -f2)
    READABLE_DATE=$(date -j -f "%Y%m%d" "$DATE_PART" "+%Y-%m-%d" 2>/dev/null || echo $DATE_PART)
    READABLE_TIME=$(echo $TIME_PART | sed 's/\(..\)\(..\)\(..\)/\1:\2:\3/')

    echo "  [$INDEX] $READABLE_DATE $READABLE_TIME"
    echo "      Files:"
    ls -lh $BACKUP_DIR/*_$TS* 2>/dev/null | awk '{print "        " $9 " (" $5 ")"}'
    echo ""
    INDEX=$((INDEX+1))
done

# Prompt user to select backup
echo ""
print_prompt "Enter the number of the backup to restore (1-$((INDEX-1))): "
read -r SELECTION

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -ge $INDEX ]; then
    print_error "Invalid selection"
    exit 1
fi

SELECTED_TIMESTAMP=${TIMESTAMP_ARRAY[$SELECTION]}
print_info "Selected backup: $SELECTED_TIMESTAMP"

# Confirmation
echo ""
print_warning "WARNING: This will replace your current Strapi data!"
print_prompt "Are you sure you want to continue? (yes/no): "
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_info "Restore cancelled"
    exit 0
fi

# Stop containers
print_info "Stopping containers..."
cd $DOCKER_DIR
$CONTAINER_CMD down

# Create safety backup of current state
print_info "Creating safety backup of current state..."
SAFETY_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SAFETY_BACKUP_DIR=$BACKUP_DIR/safety_backup_$SAFETY_TIMESTAMP
mkdir -p $SAFETY_BACKUP_DIR

if [ -d "$CMS_DIR/database" ]; then
    cp -r "$CMS_DIR/database" "$SAFETY_BACKUP_DIR/"
fi
if [ -d "$CMS_DIR/.tmp" ]; then
    cp -r "$CMS_DIR/.tmp" "$SAFETY_BACKUP_DIR/"
fi
if [ -f "$CMS_DIR/.env" ]; then
    cp "$CMS_DIR/.env" "$SAFETY_BACKUP_DIR/"
fi
if [ -d "$CMS_DIR/public" ]; then
    cp -r "$CMS_DIR/public" "$SAFETY_BACKUP_DIR/"
fi

print_info "Safety backup created at: $SAFETY_BACKUP_DIR"

# Restore database
if [ -f "$BACKUP_DIR/database_$SELECTED_TIMESTAMP.tar.gz" ]; then
    print_info "Restoring database..."
    rm -rf "$CMS_DIR/database"
    tar -xzf "$BACKUP_DIR/database_$SELECTED_TIMESTAMP.tar.gz" -C $CMS_DIR
    print_info "Database restored"
fi

# Restore SQLite database
if [ -f "$BACKUP_DIR/sqlite_$SELECTED_TIMESTAMP.tar.gz" ]; then
    print_info "Restoring SQLite database..."
    rm -rf "$CMS_DIR/.tmp"
    tar -xzf "$BACKUP_DIR/sqlite_$SELECTED_TIMESTAMP.tar.gz" -C $CMS_DIR
    print_info "SQLite database restored"
fi

# Restore .env file
if [ -f "$BACKUP_DIR/env_$SELECTED_TIMESTAMP" ]; then
    print_info "Restoring .env file..."
    cp "$BACKUP_DIR/env_$SELECTED_TIMESTAMP" "$CMS_DIR/.env"
    print_info ".env file restored"
fi

# Restore public uploads
if [ -f "$BACKUP_DIR/public_$SELECTED_TIMESTAMP.tar.gz" ]; then
    print_info "Restoring uploaded files..."
    rm -rf "$CMS_DIR/public"
    tar -xzf "$BACKUP_DIR/public_$SELECTED_TIMESTAMP.tar.gz" -C $CMS_DIR
    print_info "Uploaded files restored"
fi

# Restore config
if [ -f "$BACKUP_DIR/config_$SELECTED_TIMESTAMP.tar.gz" ]; then
    print_info "Restoring configuration..."
    rm -rf "$CMS_DIR/config"
    tar -xzf "$BACKUP_DIR/config_$SELECTED_TIMESTAMP.tar.gz" -C $CMS_DIR
    print_info "Configuration restored"
fi

# Start containers
print_info "Starting containers..."
cd $DOCKER_DIR
$CONTAINER_CMD up -d

# Wait for Strapi to be ready
print_info "Waiting for Strapi to start..."
COUNTER=0
MAX_ATTEMPTS=60

while [ $COUNTER -lt $MAX_ATTEMPTS ]; do
    if $CONTAINER_EXEC -T strapi wget --no-verbose --tries=1 --spider http://localhost:1337/_health 2>/dev/null; then
        print_info "Strapi is ready!"
        break
    fi
    echo -n "."
    sleep 2
    COUNTER=$((COUNTER+1))
done

echo ""

if [ $COUNTER -eq $MAX_ATTEMPTS ]; then
    print_error "Strapi failed to start after $MAX_ATTEMPTS attempts"
    print_warning "You can restore from safety backup at: $SAFETY_BACKUP_DIR"
    print_info "Check logs with: cd $DOCKER_DIR && $CONTAINER_CMD logs strapi"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}SUCCESS!${NC} Strapi restored from backup"
echo "======================================"
echo ""
print_info "Restored backup from: $SELECTED_TIMESTAMP"
print_info "Safety backup location: $SAFETY_BACKUP_DIR"
echo ""
print_info "Access Strapi admin at: http://localhost:1337/admin"
echo ""
print_info "View logs: cd $DOCKER_DIR && $CONTAINER_CMD logs -f strapi"
