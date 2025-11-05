# PetStar Website - Troubleshooting Guide

## Quick Diagnostics Script

Run this to get a quick overview of the system status:

```bash
#!/bin/bash
echo "=== PetStar Website Diagnostics ==="
echo ""
echo "1. Container Status:"
cd ~/petstar-website/docker && docker compose ps
echo ""
echo "2. Disk Space:"
df -h | grep -E "Filesystem|/$"
echo ""
echo "3. Memory Usage:"
free -h
echo ""
echo "4. Docker Stats:"
docker stats --no-stream
echo ""
echo "5. Recent Strapi Logs (last 20 lines):"
cd ~/petstar-website/docker && docker compose logs --tail=20 strapi
echo ""
echo "6. Port Usage:"
sudo netstat -tulpn | grep -E "1337|8081"
echo ""
echo "7. Strapi Health Check:"
curl -s http://localhost:1337/_health && echo "✓ Healthy" || echo "✗ Unhealthy"
```

---

## Common Issues & Solutions

### 1. Permission Denied Errors (Podman/Rootless)

#### Symptoms:
- `EACCES: permission denied, mkdir '/opt/app/database/migrations'`
- `EACCES: permission denied, open '/opt/app/.tmp/data.db'`
- Container starts but Strapi fails to initialize
- Errors about unable to create directories

#### Cause:
This is a common issue with **Podman rootless containers** where the container user doesn't have write permissions to mounted volumes. Podman runs containers as non-root by default, and the UIDs don't always match between the host and container.

#### Solution 1: Use the Regenerate Script (Recommended)
The `regenerate-strapi-db.sh` script now automatically handles permissions:
```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

The script will:
- Pre-create all necessary directories
- Set appropriate permissions (777 for Podman compatibility)
- Ensure the container can write to all required locations

#### Solution 2: Manual Permission Fix
If you encounter this error during normal operation:
```bash
cd ~/petstar-website

# Stop containers
cd docker
podman-compose down

# Fix permissions on all Strapi directories
cd ~/petstar-website/petstar-cms
chmod -R 777 database .tmp public .cache

# Restart containers
cd ~/petstar-website/docker
podman-compose up -d
```

#### Solution 3: Pre-create Directories Before First Run
If setting up for the first time:
```bash
cd ~/petstar-website/petstar-cms

# Create all necessary directories
mkdir -p database/migrations .tmp public/uploads .cache

# Set permissions
chmod -R 777 database .tmp public .cache

# Now start containers
cd ~/petstar-website/docker
podman-compose up -d
```

#### Why 777 Permissions?
With Podman rootless, the container runs as a different UID than your host user. Setting 777 (rwxrwxrwx) ensures the container can write regardless of UID mapping. This is safe because:
- These directories are inside your project folder
- Only contain application data (not system files)
- Podman provides user namespace isolation

#### Alternative: Use Podman's :z or :Z Volume Options
If you prefer more restrictive permissions, modify `docker-compose.yml` to use Podman's SELinux labeling:
```yaml
volumes:
  - ../petstar-cms/.tmp:/opt/app/.tmp:z
  - ../petstar-cms/database:/opt/app/database:z
```

The `:z` suffix tells Podman to automatically relabel the files for container access.

---

### 2. Strapi Won't Start

#### Symptoms:
- Container keeps restarting
- Cannot access admin panel at http://localhost:1337/admin
- Health check fails

#### Diagnostic Commands:
```bash
cd ~/petstar-website/docker
docker compose ps
docker compose logs strapi --tail=50
```

#### Common Causes & Solutions:

**A. Invalid or Missing .env Keys**
```bash
# Check if .env exists
ls -la ~/petstar-website/petstar-cms/.env

# Regenerate with fresh keys
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

**B. Port Already in Use**
```bash
# Check what's using port 1337
sudo netstat -tulpn | grep 1337
sudo lsof -i :1337

# If another process is using it, kill it
sudo kill -9 <PID>

# Or change Strapi port in docker-compose.yml
```

**C. Database Corruption**
```bash
# Option 1: Restore from backup
cd ~/petstar-website
./scripts/restore-strapi.sh

# Option 2: Fresh database
rm -rf ~/petstar-website/petstar-cms/database
rm -rf ~/petstar-website/petstar-cms/.tmp
cd ~/petstar-website/docker
docker compose restart strapi
```

**D. Permissions Issues**
```bash
# Fix ownership
cd ~/petstar-website
sudo chown -R $USER:$USER petstar-cms/

# Fix permissions
chmod -R 755 petstar-cms/
```

---

### 2. Cannot Access Admin Panel

#### Symptoms:
- 404 or connection refused at http://localhost:1337/admin
- CORS errors in browser console

#### Solutions:

**A. Check if Strapi is Running**
```bash
cd ~/petstar-website/docker
docker compose ps strapi

# Should show "Up" status
```

**B. Check Health Endpoint**
```bash
curl http://localhost:1337/_health

# Should return: {"status":"ok"}
```

**C. Verify CORS Configuration**
```bash
# Check docker-compose.yml has correct CORS origins
cd ~/petstar-website/docker
grep STRAPI_CORS docker-compose.yml

# Should include your domain
```

**D. Access via Cloudflare Tunnel**
```bash
# If localhost doesn't work, try public URL
# https://petstar-dash.ro/admin
```

---

### 3. Database Issues

#### Symptoms:
- "Cannot connect to database" errors
- Data not persisting
- Content disappears after restart

#### Solutions:

**A. Check Database File**
```bash
# For SQLite
ls -lh ~/petstar-website/petstar-cms/.tmp/data.db

# Should exist and have size > 0
```

**B. Check Volume Mounts**
```bash
# Verify volumes in docker-compose.yml
cd ~/petstar-website/docker
grep -A 5 "volumes:" docker-compose.yml | grep -A 3 "strapi:"

# Should mount .tmp directory
```

**C. Database Migration Issues**
```bash
# Check logs for migration errors
docker compose logs strapi | grep -i migration

# If needed, rebuild
docker compose down
docker compose up -d --build
```

---

### 4. Docker Container Issues

#### Symptoms:
- Container exits immediately
- Container in "Restarting" state
- Out of memory errors

#### Solutions:

**A. Check Docker Resources**
```bash
# Check available resources
docker system df
free -h
df -h

# Clean up if needed
docker system prune -a
```

**B. View Container Logs**
```bash
cd ~/petstar-website/docker

# Real-time logs
docker compose logs -f strapi

# Last 100 lines
docker compose logs --tail=100 strapi

# With timestamps
docker compose logs -t strapi
```

**C. Rebuild Container**
```bash
cd ~/petstar-website/docker
docker compose down
docker compose build --no-cache strapi
docker compose up -d
```

**D. Inspect Container**
```bash
# Get container details
docker compose exec strapi sh

# Inside container, check:
ls -la /opt/app
cat /opt/app/.env
ps aux
```

---

### 5. Nginx/Web Issues

#### Symptoms:
- Cannot access website at http://localhost:8081
- 502 Bad Gateway
- Static files not loading

#### Solutions:

**A. Check Nginx Status**
```bash
cd ~/petstar-website/docker
docker compose ps web
docker compose logs web
```

**B. Verify File Mounts**
```bash
# Check if files are mounted correctly
docker compose exec web ls -la /usr/share/nginx/html

# Should show index.html, assets/, sections/, etc.
```

**C. Test Nginx Config**
```bash
docker compose exec web nginx -t
```

**D. Restart Nginx**
```bash
docker compose restart web
```

---

### 6. Cloudflare Tunnel Issues

#### Symptoms:
- Cannot access via public URL
- Tunnel keeps disconnecting

#### Solutions:

**A. Check Tunnel Status**
```bash
cd ~/petstar-website/docker
docker compose ps cloudflared
docker compose logs cloudflared
```

**B. Verify Tunnel Token**
```bash
# Check if TUNNEL_TOKEN is set in .env
ls ~/petstar-website/docker/.env
cat ~/petstar-website/docker/.env | grep TUNNEL_TOKEN
```

**C. Restart Tunnel**
```bash
docker compose restart cloudflared
```

---

### 7. Performance Issues

#### Symptoms:
- Slow page loads
- High CPU/memory usage
- Container consuming too many resources

#### Diagnostics:
```bash
# Monitor resources
docker stats

# Check container resource limits
docker compose config | grep -A 5 resources
```

#### Solutions:

**A. Add Resource Limits**
Edit [docker-compose.yml](docker/docker-compose.yml) and add:
```yaml
services:
  strapi:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          memory: 512M
```

**B. Optimize Strapi**
```bash
# Clear Strapi cache
rm -rf ~/petstar-website/petstar-cms/.cache

# Restart with fresh cache
cd ~/petstar-website/docker
docker compose restart strapi
```

---

### 8. SSL/HTTPS Issues

#### Symptoms:
- SSL certificate errors
- Mixed content warnings
- HTTPS not working

#### Solutions:

**A. Check Cloudflare Tunnel**
```bash
# Ensure tunnel is routing HTTPS
docker compose logs cloudflared | grep -i ssl
```

**B. Verify Cloudflare DNS**
```bash
# Check if domain points to tunnel
nslookup petstar.ro
nslookup petstar-dash.ro
```

---

## Emergency Recovery Procedures

### Complete System Reset

If everything is broken and you need to start fresh:

```bash
# 1. Stop everything
cd ~/petstar-website/docker
docker compose down

# 2. Backup current state (just in case)
cd ~/petstar-website
./scripts/backup-strapi.sh

# 3. Remove all data
rm -rf ~/petstar-website/petstar-cms/database
rm -rf ~/petstar-website/petstar-cms/.tmp
rm -rf ~/petstar-website/petstar-cms/.cache
rm -rf ~/petstar-website/petstar-cms/node_modules

# 4. Regenerate database
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh

# 5. Verify everything is running
docker compose ps
curl http://localhost:1337/_health
curl http://localhost:8081
```

### Restore from Backup

If you need to go back to a working state:

```bash
cd ~/petstar-website
./scripts/restore-strapi.sh
# Select backup from interactive menu
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Quick health check
cd ~/petstar-website/docker
docker compose ps
curl -s http://localhost:1337/_health
curl -s http://localhost:8081 > /dev/null && echo "Web OK"
```

### Weekly Maintenance

```bash
# 1. Create backup
cd ~/petstar-website
./scripts/backup-strapi.sh

# 2. Check disk space
df -h

# 3. Clean up old Docker images
docker system prune -f

# 4. Review logs for errors
cd ~/petstar-website/docker
docker compose logs --since 168h | grep -i error
```

### Monthly Maintenance

```bash
# 1. Update Docker images
cd ~/petstar-website/docker
docker compose pull
docker compose up -d

# 2. Clean up old backups (keeps last 30 days)
find ~/petstar-website/backups -mtime +30 -delete

# 3. Review security updates
docker scout cves petstar-strapi
```

---

## Useful Commands Reference

### Container Management
```bash
cd ~/petstar-website/docker

# View all containers
docker compose ps

# View logs
docker compose logs -f
docker compose logs -f strapi
docker compose logs --tail=100 strapi

# Restart services
docker compose restart
docker compose restart strapi

# Stop all
docker compose down

# Start all
docker compose up -d

# Rebuild and start
docker compose up -d --build
```

### Database Management
```bash
# Backup
cd ~/petstar-website && ./scripts/backup-strapi.sh

# Restore
cd ~/petstar-website && ./scripts/restore-strapi.sh

# Regenerate
cd ~/petstar-website && ./scripts/regenerate-strapi-db.sh

# View SQLite database
sqlite3 ~/petstar-website/petstar-cms/.tmp/data.db
```

### System Resources
```bash
# Disk usage
df -h
du -sh ~/petstar-website/*

# Memory
free -h

# Docker resources
docker stats
docker system df

# Process list
ps aux | grep docker
```

---

## Getting Help

### Collect Diagnostics

Before asking for help, collect this information:

```bash
# Create diagnostics bundle
cd ~/petstar-website
mkdir -p diagnostics
cd diagnostics

# System info
uname -a > system_info.txt
docker --version >> system_info.txt
docker compose version >> system_info.txt

# Container status
cd ~/petstar-website/docker
docker compose ps > diagnostics/container_status.txt

# Logs
docker compose logs --tail=200 > diagnostics/all_logs.txt
docker compose logs --tail=200 strapi > diagnostics/strapi_logs.txt

# Config (remove sensitive info!)
cp ~/petstar-website/docker/docker-compose.yml diagnostics/
# Edit and remove TUNNEL_TOKEN before sharing

# Resources
docker stats --no-stream > diagnostics/docker_stats.txt
free -h > diagnostics/memory.txt
df -h > diagnostics/disk.txt

# Create archive
cd ~/petstar-website
tar -czf diagnostics_$(date +%Y%m%d_%H%M%S).tar.gz diagnostics/
```

### Log Locations

- **Strapi logs**: `docker compose logs strapi`
- **Nginx logs**: `docker compose logs web`
- **Cloudflare tunnel logs**: `docker compose logs cloudflared`
- **System logs**: `/var/log/syslog` or `journalctl -u docker`

---

## Quick Links

- [Deployment Guide](DEPLOYMENT.md)
- [Strapi Documentation](https://docs.strapi.io)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
