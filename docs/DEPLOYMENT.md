# PetStar Website - Production Deployment Guide

## Server Information
- **Server**: psh-utils
- **Deployment Path**: `~/petstar-website`
- **Services**: nginx (web), Strapi CMS, Cloudflare tunnel
- **Container Runtime**: Compatible with both Docker and Podman (auto-detected)

## Quick Start: Regenerate Strapi Database

### Method 1: Using the Automated Script (Recommended)

```bash
# SSH into the server
ssh psh-utils

# Navigate to project directory
cd ~/petstar-website

# Make the script executable
chmod +x regenerate-strapi-db.sh

# Run the script
./scripts/regenerate-strapi-db.sh
```

The script will:
1. Stop all Docker containers
2. Backup existing database and .env file to `~/petstar-website/backups/`
3. Generate fresh Strapi secret keys
4. Create new .env file
5. Remove old database
6. Rebuild and restart containers
7. Wait for Strapi to be ready

### Method 2: Manual Regeneration

If you prefer to do it manually or need more control:

```bash
# 1. Navigate to project
cd ~/petstar-website

# 2. Stop containers
cd docker
docker compose down

# 3. Backup current setup
mkdir -p ~/petstar-website/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf ~/petstar-website/backups/database_backup_$TIMESTAMP.tar.gz -C ~/petstar-website/petstar-cms database
cp ~/petstar-website/petstar-cms/.env ~/petstar-website/backups/.env_backup_$TIMESTAMP

# 4. Generate new secret keys
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# 5. Create new .env file
cat > ~/petstar-website/petstar-cms/.env << EOF
HOST=0.0.0.0
PORT=1337

# Secrets
APP_KEYS=$APP_KEYS
API_TOKEN_SALT=$API_TOKEN_SALT
ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT
JWT_SECRET=$JWT_SECRET

# Database (SQLite)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOF

# 6. Remove old database
rm -rf ~/petstar-website/petstar-cms/database
rm -rf ~/petstar-website/petstar-cms/.tmp

# 7. Restart services
cd ~/petstar-website/docker
docker compose up -d --build

# 8. Monitor startup
docker compose logs -f strapi
```

## Post-Regeneration Steps

### 1. Create Admin User
Once Strapi is running, access the admin panel:

```
http://localhost:1337/admin
```

Or if using Cloudflare tunnel, access via your public URL (e.g., `https://petstar-dash.ro/admin`)

Create your first admin user with secure credentials.

### 2. Configure Content Types
Set up your content types if they don't exist:
- News articles
- Products
- Team members
- Any other custom content types

### 3. Upload Content
Re-upload any necessary content, images, etc.

### 4. Generate API Token (if needed)
If your frontend needs an API token:
1. Go to Settings > API Tokens
2. Create a new token with appropriate permissions
3. Copy the token and update your frontend configuration

## Service Management

### Check Service Status
```bash
cd ~/petstar-website/docker
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f strapi
docker compose logs -f web
docker compose logs -f cloudflared
```

### Restart Services
```bash
cd ~/petstar-website/docker

# Restart all
docker compose restart

# Restart specific service
docker compose restart strapi
docker compose restart web
```

### Stop Services
```bash
cd ~/petstar-website/docker
docker compose down
```

### Start Services
```bash
cd ~/petstar-website/docker
docker compose up -d
```

## Environment Variables Reference

### Strapi .env (~/petstar-website/petstar-cms/.env)
```bash
HOST=0.0.0.0                          # Strapi host
PORT=1337                              # Strapi port

# Security Keys (generate fresh ones)
APP_KEYS=key1,key2,key3,key4          # 4 comma-separated base64 keys
API_TOKEN_SALT=base64string           # API token salt
ADMIN_JWT_SECRET=base64string         # Admin JWT secret
TRANSFER_TOKEN_SALT=base64string      # Transfer token salt
JWT_SECRET=base64string               # JWT secret

# Database Configuration
DATABASE_CLIENT=sqlite                 # Using SQLite
DATABASE_FILENAME=.tmp/data.db        # SQLite file path
```

### Docker .env (~/petstar-website/docker/.env)
```bash
TUNNEL_TOKEN=your_cloudflare_token    # Cloudflare tunnel token
```

## Troubleshooting

### Strapi Won't Start
```bash
# Check logs
docker compose logs strapi

# Common issues:
# 1. Invalid .env keys - regenerate them
# 2. Port conflict - check if 1337 is in use
sudo netstat -tulpn | grep 1337

# 3. Database corruption - remove and regenerate
rm -rf ~/petstar-website/petstar-cms/database
rm -rf ~/petstar-website/petstar-cms/.tmp
docker compose restart strapi
```

### Cannot Access Admin Panel
```bash
# 1. Check if Strapi is running
docker compose ps

# 2. Check health
docker compose exec strapi wget --spider http://localhost:1337/_health

# 3. Check CORS settings in docker-compose.yml
# Ensure your domain is in STRAPI_CORS_ORIGIN
```

### Database Corruption
```bash
# Restore from backup
BACKUP_FILE=~/petstar-website/backups/database_backup_TIMESTAMP.tar.gz
tar -xzf $BACKUP_FILE -C ~/petstar-website/petstar-cms/

# Or regenerate fresh database
./scripts/regenerate-strapi-db.sh
```

### Container Keeps Restarting
```bash
# Check resource usage
docker stats

# Check detailed logs
docker compose logs --tail=100 strapi

# Check disk space
df -h

# Check memory
free -h
```

## Backup Strategy

### Manual Backup
```bash
# Create backup directory
mkdir -p ~/petstar-website/backups

# Backup database
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf ~/petstar-website/backups/database_backup_$TIMESTAMP.tar.gz \
    -C ~/petstar-website/petstar-cms database

# Backup .env
cp ~/petstar-website/petstar-cms/.env \
    ~/petstar-website/backups/.env_backup_$TIMESTAMP

# Backup uploaded files
tar -czf ~/petstar-website/backups/public_backup_$TIMESTAMP.tar.gz \
    -C ~/petstar-website/petstar-cms public
```

### Automated Backup (Recommended)
Create a cron job to backup daily:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/yourusername/petstar-website/backup-strapi.sh
```

## URLs

### Development (Local)
- Website: http://localhost:8081
- Strapi Admin: http://localhost:1337/admin
- Strapi API: http://localhost:1337/api

### Production (via Cloudflare Tunnel)
- Website: https://petstar.ro
- Strapi Dashboard: https://petstar-dash.ro
- Strapi API: https://petstar-dash.ro/api

## Security Notes

1. **Never commit .env files** to git
2. **Use strong admin passwords** for Strapi
3. **Regenerate keys** if you suspect compromise
4. **Regular backups** are essential
5. **Update Docker images** regularly for security patches
6. **Restrict API token permissions** to minimum required

## Architecture

```
┌─────────────────────────────────────────┐
│         Cloudflare Tunnel               │
│  (cloudflared container - host mode)    │
└────────────┬────────────────────────────┘
             │
             ├──> petstar.ro ──> nginx:8081 (Static Website)
             │                      │
             │                      └──> /usr/share/nginx/html
             │
             └──> petstar-dash.ro ──> strapi:1337 (CMS)
                                        │
                                        └──> SQLite DB in .tmp/data.db
```

## Quick Reference Commands

```bash
# Navigate to project
cd ~/petstar-website/docker

# View all services
docker compose ps

# View logs
docker compose logs -f

# Restart everything
docker compose restart

# Full rebuild
docker compose down && docker compose up -d --build

# Access Strapi container shell
docker compose exec strapi sh

# Check Strapi health
curl http://localhost:1337/_health

# Regenerate database
cd ~/petstar-website && ./scripts/regenerate-strapi-db.sh
```
