# PetStar Website - Quick Start with Docker

**All Docker files are located in the `docker/` directory.**

## Prerequisites

- Docker and Docker Compose installed
- ✅ **SELinux Compatible** - Works on Fedora, RHEL, CentOS without modifications

## Setup (First Time)

```bash
# Navigate to docker directory
cd docker

# 1. Create environment file
cp .env.example .env

# 2. Generate secure secrets (run 4 times, copy each output)
openssl rand -base64 32

# 3. Edit .env and paste the secrets
nano .env

# 4. Start services
make up
# or: docker-compose up -d

# 5. Check if services are running
make ps
# or: docker-compose ps
```

## Initial Strapi Configuration

```bash
# 1. Open Strapi admin panel
open http://localhost:1337/admin

# 2. Create admin account (first time only)

# 3. Create API Token:
#    - Settings → API Tokens → Create new API Token
#    - Name: "Frontend Public Read"
#    - Token type: Read-only
#    - Permissions: Article → find, findOne
#    - Copy the token!

# 4. Update website config with token (from project root)
nano assets/js/config.js
# Paste token into apiToken field

# 5. Reload website
open http://localhost:8081
```

## Daily Usage

**Important**: Run all commands from the `docker/` directory!

```bash
cd docker

# Start services
make up

# View logs
make logs
# or: docker-compose logs -f

# Stop services
make down
# or: docker-compose down

# Restart services
make restart
# or: docker-compose restart

# Check status
make ps
# or: docker-compose ps
```

## Common Tasks

### Create Article in Strapi
1. Open http://localhost:1337/admin
2. Go to Content Manager → Article → Create new entry
3. Fill in: title, excerpt, content, category, images
4. Set Language to "en" (or "ro")
5. Click Publish

### Backup Data
```bash
cd docker
make backup
# Creates backup in docker/backups/ directory
```

### Restore Data
```bash
cd docker
make restore FILE=backups/strapi-backup-20251103-123456.tar.gz
```

## Troubleshooting

### Website shows "No articles available"
```bash
cd docker

# Check if Strapi is running
docker-compose ps

# Check Strapi logs
make logs-strapi

# Verify API token in ../assets/js/config.js
# Verify article language is "en" in Strapi
```

### Port already in use
```bash
# Change ports in docker-compose.yml
# For web: "8082:80" instead of "8081:80"
# For Strapi: "1338:1337" instead of "1337:1337"
```

### Services won't start
```bash
cd docker

# View logs
make logs

# Clean and restart
docker-compose down
docker-compose up -d
```

## Access Points

- **Website**: http://localhost:8081
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api

## File Structure

```
petstar-website/
├── docker/
│   ├── docker-compose.yml      # Docker services configuration
│   ├── nginx.conf              # Web server configuration
│   ├── .env                    # Environment variables (create from .env.example)
│   ├── .env.example            # Environment template
│   ├── Makefile                # Convenience commands
│   └── backups/                # Backup directory
├── assets/
│   └── js/
│       ├── config.js           # Website configuration (update API token here)
│       └── news-loader.js      # News fetching logic
└── sections/
    └── section-10-news.html    # News section template
```

## Next Steps

1. Create articles in Strapi
2. Upload images for articles
3. Set up automatic backups
4. Configure for production (see README-DOCKER.md)

