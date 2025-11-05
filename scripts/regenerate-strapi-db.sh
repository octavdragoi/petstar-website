#!/bin/bash

# Strapi Database Regeneration Script
# This script will regenerate the Strapi database with fresh secret keys
# Compatible with both Docker and Podman

set -e  # Exit on any error

echo "======================================"
echo "Strapi Database Regeneration Script"
echo "======================================"
echo ""

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
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to generate random secret key
generate_secret() {
    openssl rand -base64 32
}

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

# Step 1: Navigate to project directory
print_info "Navigating to project directory: $PROJECT_DIR"
cd $PROJECT_DIR || { print_error "Failed to navigate to $PROJECT_DIR"; exit 1; }

# Step 2: Create backup directory
print_info "Creating backup directory..."
mkdir -p $BACKUP_DIR

# Step 3: Stop running containers
print_info "Stopping containers..."
cd $DOCKER_DIR
$CONTAINER_CMD down || print_warning "Containers may not be running"

# Step 4: Backup current database
print_info "Backing up current database and .env file..."
if [ -d "$CMS_DIR/database" ]; then
    tar -czf "$BACKUP_DIR/database_backup_$TIMESTAMP.tar.gz" -C $CMS_DIR database
    print_info "Database backed up to: $BACKUP_DIR/database_backup_$TIMESTAMP.tar.gz"
else
    print_warning "No database directory found to backup"
fi

if [ -f "$CMS_DIR/.env" ]; then
    cp "$CMS_DIR/.env" "$BACKUP_DIR/.env_backup_$TIMESTAMP"
    print_info ".env backed up to: $BACKUP_DIR/.env_backup_$TIMESTAMP"
fi

# Step 5: Generate new secret keys
print_info "Generating new secret keys..."
APP_KEYS=$(generate_secret),$(generate_secret),$(generate_secret),$(generate_secret)
API_TOKEN_SALT=$(generate_secret)
ADMIN_JWT_SECRET=$(generate_secret)
TRANSFER_TOKEN_SALT=$(generate_secret)
JWT_SECRET=$(generate_secret)

# Step 6: Create new .env file
print_info "Creating new .env file..."
cat > "$CMS_DIR/.env" << EOF
HOST=0.0.0.0
PORT=1337

# Secrets - Generated on $TIMESTAMP
APP_KEYS=$APP_KEYS
API_TOKEN_SALT=$API_TOKEN_SALT
ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT
JWT_SECRET=$JWT_SECRET

# Database (SQLite)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOF

print_info "New .env file created with fresh keys"

# Step 7: Remove old database
print_info "Removing old database..."
rm -rf "$CMS_DIR/database"
rm -rf "$CMS_DIR/.tmp"
print_info "Old database removed"

# Step 8: Remove node_modules and package-lock (optional, for clean rebuild)
read -p "Do you want to remove node_modules for a clean rebuild? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Removing node_modules..."
    rm -rf "$CMS_DIR/node_modules"
    print_info "node_modules removed"
fi

# Step 9: Rebuild and start containers
print_info "Rebuilding and starting containers..."
cd $DOCKER_DIR
$CONTAINER_CMD up -d --build

# Step 10: Wait for Strapi to be ready
print_info "Waiting for Strapi to initialize (this may take 30-60 seconds)..."
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

if [ $COUNTER -eq $MAX_ATTEMPTS ]; then
    print_error "Strapi failed to start after $MAX_ATTEMPTS attempts"
    print_info "Check logs with: cd $DOCKER_DIR && $CONTAINER_CMD logs strapi"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}SUCCESS!${NC} Strapi database regenerated"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Access Strapi admin at: http://localhost:1337/admin"
echo "2. Create a new admin user"
echo "3. Configure your content types and data"
echo ""
echo "Backup location: $BACKUP_DIR"
echo "- Database: database_backup_$TIMESTAMP.tar.gz"
echo "- Old .env: .env_backup_$TIMESTAMP"
echo ""
print_info "View Strapi logs: cd $DOCKER_DIR && $CONTAINER_CMD logs -f strapi"
