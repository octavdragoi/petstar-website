# PetStar Server - Quick Reference Card

## 🚀 Most Common Commands

### SSH to Server
```bash
ssh psh-utils
cd ~/petstar-website
```

### Regenerate Database (Fresh Start)
```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

### Create Backup
```bash
cd ~/petstar-website
./scripts/backup-strapi.sh
```

### Restore from Backup
```bash
cd ~/petstar-website
./scripts/restore-strapi.sh
```

### Check Status
```bash
cd ~/petstar-website/docker
docker compose ps
```

### View Logs
```bash
cd ~/petstar-website/docker
docker compose logs -f strapi
```

### Restart Everything
```bash
cd ~/petstar-website/docker
docker compose restart
```

### Stop Everything
```bash
cd ~/petstar-website/docker
docker compose down
```

### Start Everything
```bash
cd ~/petstar-website/docker
docker compose up -d
```

---

## 🔗 URLs

| Service | Local | Production |
|---------|-------|------------|
| Website | http://localhost:8081 | https://petstar.ro |
| Strapi Admin | http://localhost:1337/admin | https://petstar-dash.ro/admin |
| Strapi API | http://localhost:1337/api | https://petstar-dash.ro/api |

---

## 📂 Important Paths

| What | Path |
|------|------|
| Project Root | `~/petstar-website` |
| Docker Configs | `~/petstar-website/docker` |
| Strapi CMS | `~/petstar-website/petstar-cms` |
| Strapi .env | `~/petstar-website/petstar-cms/.env` |
| Database | `~/petstar-website/petstar-cms/.tmp/data.db` |
| Backups | `~/petstar-website/backups` |
| Website Files | `~/petstar-website/` (index.html, assets/, sections/) |

---

## 🔥 Emergency Commands

### Something's Broken - Quick Fix
```bash
cd ~/petstar-website/docker
docker compose restart
```

### Still Broken - Rebuild
```bash
cd ~/petstar-website/docker
docker compose down
docker compose up -d --build
```

### Everything's Broken - Fresh Start
```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

### Need to Go Back - Restore Backup
```bash
cd ~/petstar-website
./scripts/restore-strapi.sh
```

---

## 🩺 Health Checks

### Quick Status Check
```bash
# All services
cd ~/petstar-website/docker && docker compose ps

# Strapi health
curl http://localhost:1337/_health

# Web server
curl -I http://localhost:8081
```

### Check Logs for Errors
```bash
cd ~/petstar-website/docker
docker compose logs --tail=50 | grep -i error
```

### Resource Usage
```bash
docker stats --no-stream
free -h
df -h
```

---

## 🛠️ Troubleshooting Quick Fixes

### Strapi Won't Start
```bash
# Check logs
docker compose logs strapi

# Try restart
docker compose restart strapi

# If still broken, regenerate
cd ~/petstar-website && ./scripts/regenerate-strapi-db.sh
```

### Can't Access Admin Panel
```bash
# Check if running
docker compose ps strapi

# Check health
curl http://localhost:1337/_health

# Try public URL instead
# https://petstar-dash.ro/admin
```

### Database Issues
```bash
# Remove and restart
rm -rf ~/petstar-website/petstar-cms/.tmp
cd ~/petstar-website/docker && docker compose restart strapi
```

### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep -E "1337|8081"

# Kill process or change port in docker-compose.yml
```

### Out of Disk Space
```bash
# Check space
df -h

# Clean Docker
docker system prune -a

# Remove old backups
find ~/petstar-website/backups -mtime +30 -delete
```

---

## 📋 Before You Leave Checklist

- [ ] All services running: `docker compose ps`
- [ ] Strapi accessible: `curl http://localhost:1337/_health`
- [ ] Website accessible: `curl http://localhost:8081`
- [ ] Recent backup exists: `ls -lh ~/petstar-website/backups/`
- [ ] No errors in logs: `docker compose logs --tail=20`

---

## 📞 Help Resources

| Resource | Location |
|----------|----------|
| Full Deployment Guide | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Troubleshooting | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Scripts Documentation | [SERVER-SCRIPTS-README.md](SERVER-SCRIPTS-README.md) |
| This Quick Reference | [QUICK-REFERENCE.md](QUICK-REFERENCE.md) |

---

## ⚡ Pro Tips

1. **Always backup before changes**: `./scripts/backup-strapi.sh`
2. **Check logs first**: `docker compose logs -f strapi`
3. **Use screen/tmux**: For long operations
4. **Monitor resources**: `docker stats`
5. **Test backups**: Restore periodically to verify
6. **Keep notes**: Document what you change
7. **Automate backups**: Set up cron job

---

## 🔐 Security Reminders

- ✅ Use strong Strapi admin passwords
- ✅ Keep .env files secret
- ✅ Regular backups
- ✅ Update Docker images monthly
- ❌ Never commit .env to git
- ❌ Never share tunnel tokens
- ❌ Never run as root if avoidable

---

**Print this page and keep it handy!**
