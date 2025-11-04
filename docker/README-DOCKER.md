# PetStar Website - Docker Setup

This document explains how to run the PetStar website and Strapi CMS using Docker.

**Note**: All Docker files are located in the `docker/` directory.

## Prerequisites

- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Install Docker Compose](https://docs.docker.com/compose/install/))
- **SELinux Compatible**: Volume mounts are configured with `:z` flag for SELinux systems (Fedora, RHEL, CentOS)

## Quick Start

### 1. Environment Setup

```bash
# Navigate to docker directory
cd docker

# Copy the example environment file
cp .env.example .env

# Edit .env and update the secrets (important for production!)
nano .env
```

**Important**: Generate secure random strings for production:
```bash
# Generate random secrets
openssl rand -base64 32
```

### 2. Start Services

```bash
# From the docker directory
cd docker

# Start both web server and Strapi
docker-compose up -d
# or use make
make up

# View logs
docker-compose logs -f
# or
make logs

### 3. Access Services

- **Website**: http://localhost:8081
- **Strapi Admin**: http://localhost:1337/admin

### 4. Initial Strapi Setup

On first run, you need to create an admin user:

1. Open http://localhost:1337/admin
2. Create your admin account
3. Create an API Token:
   - Go to Settings → API Tokens
   - Click "Create new API Token"
   - Name: "Frontend Public Read"
   - Token type: Read-only
   - Permissions: Enable `find` and `findOne` for Article
   - Copy the token (shown only once!)
4. Update `assets/js/config.js` with your API token

### 5. Import Existing Strapi Data (Optional)

If you have an existing Strapi instance:

```bash
# Navigate to docker directory
cd docker

# Stop containers
docker-compose down

# Copy your Strapi data
# Option 1: Copy entire Strapi directory
cp -r /path/to/existing/strapi/* ./strapi-data/

# Option 2: Export/import using Strapi plugins
# Use strapi-plugin-import-export-entries or similar

# Restart
docker-compose up -d
```

## Managing Services

**Note**: Run all commands from the `docker/` directory, or use `cd docker && make <command>`

### Stop Services

```bash
cd docker

# Stop services (preserves data)
docker-compose stop
# or
make down

# Stop and remove containers (preserves data in volumes)
docker-compose down

# Stop and remove everything including volumes (DELETES DATA!)
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart web
docker-compose restart strapi
```

### Update Services

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### View Status

```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats
```

## Configuration

### Website Configuration

Edit `assets/js/config.js`:

```javascript
const PetStarConfig = {
    // In Docker, Strapi is accessible at localhost:1337 from the host
    // or at http://strapi:1337 from within the Docker network
    apiUrl: 'http://localhost:1337/api',
    apiToken: 'your-strapi-api-token-here',
    // ... other settings
};
```

### Strapi Configuration

Strapi settings are in `.env` file. Main variables:

- `ADMIN_JWT_SECRET`: Secret for admin JWT tokens
- `APP_KEYS`: Application keys (comma-separated)
- `API_TOKEN_SALT`: Salt for API tokens
- `JWT_SECRET`: Secret for JWT generation
- `DATABASE_CLIENT`: Database type (sqlite, postgres, mysql)

### CORS Configuration

Strapi CORS is configured to allow requests from the web container. If you need to allow additional origins:

1. Access Strapi admin
2. Go to Settings → Advanced Settings → CORS
3. Add your domain (e.g., `http://localhost:8081`)

Or set environment variables in `docker-compose.yml`:

```yaml
environment:
  - STRAPI_CORS_ENABLED=true
  - STRAPI_CORS_ORIGIN=http://localhost:8081,http://127.0.0.1:8081,https://yourdomain.com
```

## Production Deployment

### 1. Use PostgreSQL Instead of SQLite

Update `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: petstar-postgres
    environment:
      - POSTGRES_DB=strapi
      - POSTGRES_USER=strapi
      - POSTGRES_PASSWORD=your-secure-password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - petstar-network
    restart: unless-stopped

  strapi:
    depends_on:
      - postgres
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=strapi
      - DATABASE_USERNAME=strapi
      - DATABASE_PASSWORD=your-secure-password
      - DATABASE_SSL=false

volumes:
  postgres-data:
```

### 2. Update Secrets

Generate new secure secrets:

```bash
# Generate multiple secrets
for i in {1..4}; do openssl rand -base64 32; done
```

Update `.env` with these values.

### 3. Enable HTTPS

Add Nginx SSL configuration or use a reverse proxy like Traefik/Caddy.

### 4. Update API URL

In `assets/js/config.js`, update to production domain:

```javascript
apiUrl: 'https://api.yourdomain.com/api',
```

### 5. Security Checklist

- [ ] Changed all default secrets in `.env`
- [ ] Using PostgreSQL instead of SQLite
- [ ] HTTPS enabled
- [ ] Firewall configured (only ports 80/443 exposed)
- [ ] Strapi admin accessible only through VPN or IP whitelist
- [ ] API tokens rotated regularly
- [ ] Backups configured

## Backup and Restore

### Backup Strapi Data

```bash
cd docker

# Backup volume
make backup
# or manually:
docker run --rm -v petstar-website_strapi-data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/strapi-backup-$(date +%Y%m%d).tar.gz /data

# Or backup using docker-compose
docker-compose exec strapi tar czf /tmp/backup.tar.gz /srv/app
docker cp petstar-strapi:/tmp/backup.tar.gz ./backups/
```

### Restore Strapi Data

```bash
cd docker

# Restore from backup
make restore FILE=backups/strapi-backup-20251103.tar.gz
# or manually:
docker-compose down
docker run --rm -v petstar-website_strapi-data:/data -v $(pwd):/backup alpine tar xzf /backup/strapi-backup-20251103.tar.gz -C /
docker-compose up -d
```

## Troubleshooting

### SELinux Permission Denied Errors

If you see "Permission denied" errors on SELinux systems (Fedora, RHEL, CentOS):

```bash
# The docker-compose.yml already includes :z flags for SELinux
# If you still have issues, check SELinux status
getenforce

# Temporarily set to permissive for testing (not recommended for production)
sudo setenforce 0

# Check SELinux denials
sudo ausearch -m avc -ts recent

# If needed, you can also run containers with --privileged (not recommended)
# or create custom SELinux policies
```

The volume mounts in `docker-compose.yml` use the `:z` flag which automatically sets the correct SELinux context.

### Strapi won't start

```bash
# Check logs
docker-compose logs strapi

# Common issues:
# 1. Port 1337 already in use - change port in docker-compose.yml
# 2. Permission issues - check volume permissions
# 3. Database connection - verify DATABASE_* variables
```

### Website shows "No articles available"

```bash
# Check if Strapi is running
docker-compose ps

# Check Strapi health
curl http://localhost:1337/_health

# Check API token in config.js
# Check CORS settings in Strapi admin
```

### CORS errors in browser

1. Check Strapi CORS settings
2. Verify API URL in `config.js` matches Strapi URL
3. Check browser console for specific error

### Data persistence

Data is stored in Docker volumes:
- `strapi-data`: All Strapi files and database

To list volumes:
```bash
docker volume ls
```

To inspect volume:
```bash
docker volume inspect petstar-website_strapi-data
```

## Development vs Production

### Development Setup

```yaml
# docker-compose.override.yml (auto-loaded in development)
services:
  strapi:
    environment:
      - NODE_ENV=development
    command: npm run develop
```

### Production Setup

Use the main `docker-compose.yml` as-is, with production `.env` values.

## Monitoring

```bash
# Container health
docker-compose ps

# Resource usage
docker stats

# Logs
docker-compose logs -f --tail=100

# Strapi health endpoint
curl http://localhost:1337/_health
```

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Check Strapi documentation: https://docs.strapi.io
4. Check Docker documentation: https://docs.docker.com
