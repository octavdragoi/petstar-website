# PetStar Server Management Scripts

This directory contains scripts to help you manage your PetStar website deployment on the psh-utils server.

**🐳 Container Runtime**: All scripts are **fully compatible with both Docker and Podman**. They automatically detect which runtime is available on your system. See [DOCKER-PODMAN-COMPATIBILITY.md](DOCKER-PODMAN-COMPATIBILITY.md) for details.

## 📦 What's Included

### Management Scripts (in `scripts/`)

1. **[regenerate-strapi-db.sh](../scripts/regenerate-strapi-db.sh)** - Regenerate Strapi database with fresh keys
2. **[backup-strapi.sh](../scripts/backup-strapi.sh)** - Create complete backup of Strapi data
3. **[restore-strapi.sh](../scripts/restore-strapi.sh)** - Restore Strapi from a backup

### Documentation (in `docs/`)

1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
2. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Troubleshooting guide with solutions
3. **[SERVER-SCRIPTS-README.md](SERVER-SCRIPTS-README.md)** - This file
4. **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - One-page cheat sheet
5. **[DOCKER-PODMAN-COMPATIBILITY.md](DOCKER-PODMAN-COMPATIBILITY.md)** - Container runtime compatibility

---

## 🚀 Quick Start: Deploy to psh-utils

### Step 1: Copy Files to Server

```bash
# From your local machine
cd /Users/octavdragoi/github/petstar-website

# Copy entire project to server
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ psh-utils:~/petstar-website/

# Or use scp
scp -r ./* psh-utils:~/petstar-website/
```

### Step 2: SSH into Server

```bash
ssh psh-utils
```

### Step 3: Make Scripts Executable

```bash
cd ~/petstar-website
chmod +x scripts/*.sh
```

### Step 4: Regenerate Strapi Database

```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

This will:
- Stop Docker containers
- Backup existing database and .env
- Generate fresh secret keys
- Create new .env file
- Remove old database
- Rebuild and start containers
- Wait for Strapi to be ready

### Step 5: Access Strapi Admin

Once the script completes:

```bash
# If accessing locally on server
http://localhost:1337/admin

# If using Cloudflare tunnel
https://petstar-dash.ro/admin
```

Create your first admin user and start configuring content.

---

## 📋 Script Details

### regenerate-strapi-db.sh

**Purpose**: Completely regenerate the Strapi database with fresh secret keys

**When to use**:
- First deployment
- After cloning the repo
- When keys are compromised
- When database is corrupted
- To start fresh

**What it does**:
1. Stops all Docker containers
2. Creates backup in `~/petstar-website/backups/`
3. Generates 5 new secret keys (APP_KEYS, API_TOKEN_SALT, etc.)
4. Creates new `.env` file
5. Removes old database directories
6. Rebuilds and starts containers
7. Waits for Strapi to be healthy

**Usage**:
```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

**Options**:
- During execution, you'll be asked if you want to remove `node_modules` for a clean rebuild

**Output**:
- Backup files in `~/petstar-website/backups/`
- New database in `~/petstar-website/petstar-cms/.tmp/`
- New `.env` in `~/petstar-website/petstar-cms/.env`

---

### backup-strapi.sh

**Purpose**: Create a complete backup of all Strapi data

**When to use**:
- Before major changes
- Daily/weekly maintenance
- Before updating Strapi
- Before regenerating database

**What it backs up**:
- SQLite database (`petstar-cms/.tmp/`)
- Database directory (`petstar-cms/database/`)
- Uploaded files (`petstar-cms/public/`)
- Configuration (`petstar-cms/config/`)
- Environment variables (`petstar-cms/.env`)

**Usage**:
```bash
cd ~/petstar-website
./scripts/backup-strapi.sh
```

**Backup location**: `~/petstar-website/backups/`

**Backup files created**:
- `database_TIMESTAMP.tar.gz`
- `sqlite_TIMESTAMP.tar.gz`
- `public_TIMESTAMP.tar.gz`
- `config_TIMESTAMP.tar.gz`
- `env_TIMESTAMP`

**Retention**: Automatically deletes backups older than 30 days

**Automated backups** (optional):
```bash
# Add to crontab for daily backups at 2 AM
crontab -e

# Add this line:
0 2 * * * /home/yourusername/petstar-website/backup-strapi.sh >> /home/yourusername/petstar-website/backup.log 2>&1
```

---

### restore-strapi.sh

**Purpose**: Restore Strapi from a previous backup

**When to use**:
- After accidental data deletion
- To rollback to a working state
- After a failed update
- When recovering from corruption

**What it does**:
1. Lists all available backups with timestamps
2. Lets you select which backup to restore
3. Creates a safety backup of current state
4. Stops containers
5. Restores database, uploads, config, and .env
6. Restarts containers
7. Waits for Strapi to be healthy

**Usage**:
```bash
cd ~/petstar-website
./scripts/restore-strapi.sh
```

**Interactive menu**:
```
Available backups:
  [1] 2025-01-15 14:30:00
      Files:
        database_20250115_143000.tar.gz (2.5M)
        sqlite_20250115_143000.tar.gz (1.2M)
        ...
  [2] 2025-01-14 10:15:00
      ...

Enter the number of the backup to restore (1-2): 1
```

**Safety features**:
- Creates safety backup before restoring
- Requires confirmation before proceeding
- Shows detailed backup information

---

## 🔧 Common Tasks

### Initial Deployment

```bash
# 1. Copy files to server
rsync -avz ./ psh-utils:~/petstar-website/

# 2. SSH to server
ssh psh-utils

# 3. Make scripts executable
cd ~/petstar-website
chmod +x *.sh

# 4. Set up Cloudflare tunnel token (if not done)
echo "TUNNEL_TOKEN=your_token_here" > ~/petstar-website/docker/.env

# 5. Regenerate Strapi database
./regenerate-strapi-db.sh

# 6. Access admin panel
# Visit: https://petstar-dash.ro/admin
# Create admin user
```

### Daily Operations

```bash
# Check status
cd ~/petstar-website/docker
docker compose ps

# View logs
docker compose logs -f strapi

# Restart services
docker compose restart
```

### Before Making Changes

```bash
# Always backup first!
cd ~/petstar-website
./backup-strapi.sh
```

### After Problem Occurs

```bash
# Restore from backup
cd ~/petstar-website
./restore-strapi.sh
```

### Weekly Maintenance

```bash
# Create backup
cd ~/petstar-website
./backup-strapi.sh

# Check logs for errors
cd ~/petstar-website/docker
docker compose logs --since 168h | grep -i error

# Clean up Docker
docker system prune -f
```

---

## 📁 File Structure

```
petstar-website/
├── docker/
│   ├── docker-compose.yml          # Docker services configuration
│   ├── nginx.conf                   # Nginx configuration
│   └── .env                         # Cloudflare tunnel token
├── petstar-cms/
│   ├── .env                         # Strapi secrets (generated by script)
│   ├── .tmp/                        # SQLite database
│   ├── database/                    # Database backups
│   ├── public/                      # Uploaded files
│   ├── config/                      # Strapi configuration
│   └── src/                         # Strapi source code
├── backups/                         # Backup files (created by scripts)
│   ├── database_*.tar.gz
│   ├── sqlite_*.tar.gz
│   ├── public_*.tar.gz
│   ├── config_*.tar.gz
│   └── env_*
├── sections/                        # Website HTML sections
├── assets/                          # Website assets (CSS, JS, images)
├── index.html                       # Main website file
├── regenerate-strapi-db.sh         # Database regeneration script
├── backup-strapi.sh                # Backup script
├── restore-strapi.sh               # Restore script
├── DEPLOYMENT.md                   # Deployment guide
├── TROUBLESHOOTING.md              # Troubleshooting guide
└── SERVER-SCRIPTS-README.md        # This file
```

---

## 🌐 URLs

### Local (on server)
- Website: http://localhost:8081
- Strapi Admin: http://localhost:1337/admin
- Strapi API: http://localhost:1337/api

### Production (via Cloudflare Tunnel)
- Website: https://petstar.ro
- Strapi Dashboard: https://petstar-dash.ro
- Strapi API: https://petstar-dash.ro/api

---

## 🔑 Environment Variables

### Strapi .env (~/petstar-website/petstar-cms/.env)

Generated automatically by `regenerate-strapi-db.sh`:

```bash
HOST=0.0.0.0
PORT=1337

# Security keys (automatically generated)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=base64string
ADMIN_JWT_SECRET=base64string
TRANSFER_TOKEN_SALT=base64string
JWT_SECRET=base64string

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### Docker .env (~/petstar-website/docker/.env)

You need to create this manually:

```bash
TUNNEL_TOKEN=your_cloudflare_tunnel_token_here
```

---

## ⚠️ Important Notes

### Security
- **Never commit `.env` files** to git
- **Always use strong passwords** for Strapi admin
- **Regenerate keys** if you suspect compromise
- **Backup regularly** - automate if possible

### Backups
- Backups are stored in `~/petstar-website/backups/`
- Old backups (>30 days) are automatically deleted
- Each backup is timestamped for easy identification
- Always create a backup before major changes

### Database
- Using SQLite for simplicity
- Database file: `~/petstar-website/petstar-cms/.tmp/data.db`
- Regenerating database **deletes all content**
- Always backup before regenerating

### Docker
- Services are defined in `docker/docker-compose.yml`
- Three services: web (nginx), strapi, cloudflared
- All services restart automatically on failure
- Use `docker compose` commands from `~/petstar-website/docker/`

---

## 🆘 Getting Help

### Quick Diagnostics

```bash
# Run this to check everything
cd ~/petstar-website/docker

echo "=== Container Status ==="
docker compose ps

echo "=== Strapi Health ==="
curl -s http://localhost:1337/_health

echo "=== Web Status ==="
curl -s http://localhost:8081 > /dev/null && echo "OK" || echo "FAILED"

echo "=== Recent Errors ==="
docker compose logs --tail=50 | grep -i error

echo "=== Disk Space ==="
df -h | grep -E "/$"

echo "=== Memory ==="
free -h
```

### Check Logs

```bash
# All services
cd ~/petstar-website/docker
docker compose logs -f

# Strapi only
docker compose logs -f strapi

# Last 100 lines
docker compose logs --tail=100 strapi

# With timestamps
docker compose logs -t strapi
```

### Common Issues

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions to common problems.

### Emergency Reset

If everything is broken:

```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

This will give you a fresh start.

---

## 📚 Additional Resources

- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Strapi Docs**: https://docs.strapi.io
- **Docker Compose Docs**: https://docs.docker.com/compose/
- **Cloudflare Tunnel Docs**: https://developers.cloudflare.com/cloudflare-one/

---

## ✅ Checklist

### First Time Setup
- [ ] Copy files to server
- [ ] Make scripts executable
- [ ] Set Cloudflare tunnel token in `docker/.env`
- [ ] Run `regenerate-strapi-db.sh`
- [ ] Create admin user in Strapi
- [ ] Configure content types
- [ ] Test website access

### Regular Maintenance
- [ ] Daily: Check container status
- [ ] Weekly: Create backup
- [ ] Weekly: Check logs for errors
- [ ] Monthly: Update Docker images
- [ ] Monthly: Clean up old backups

### Before Making Changes
- [ ] Create backup
- [ ] Test in development first
- [ ] Document changes
- [ ] Have rollback plan ready

### After Problems
- [ ] Check logs
- [ ] Review troubleshooting guide
- [ ] Try restore from backup
- [ ] Last resort: regenerate database

---

## 💡 Tips

1. **Automate backups** - Set up a cron job for daily backups
2. **Monitor regularly** - Check logs weekly for issues
3. **Keep backups safe** - Consider copying to another location
4. **Test restores** - Periodically test that backups work
5. **Document changes** - Keep notes on what you modify
6. **Update regularly** - Keep Docker images and Strapi updated
7. **Use screen/tmux** - For long-running operations
8. **Check disk space** - Ensure enough space for backups

---

## 🤝 Contributing

If you improve these scripts or documentation:
1. Test thoroughly
2. Document changes
3. Update version notes
4. Share with team

---

**Last Updated**: 2025-01-15
**Version**: 1.0
**Maintainer**: PetStar Development Team
