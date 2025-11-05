# Docker Health Checks Guide

## Overview

All services in the PetStar stack now have comprehensive health checks configured. This allows Docker/Podman to monitor service health and restart containers automatically if they become unhealthy.

## Health Check Configuration

### Service Health Status

Check the health of all services:

```bash
cd ~/petstar-website/docker
docker compose ps
# or
podman-compose ps
```

Output shows health status:
```
NAME                 STATUS              HEALTH
petstar-web          Up 5 minutes        healthy
petstar-strapi       Up 5 minutes        healthy
petstar-cloudflared  Up 5 minutes        healthy
```

## Individual Service Health Checks

### 1. Strapi (CMS)

**Health Check**: HTTP request to `/_health` endpoint

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1"]
  interval: 30s        # Check every 30 seconds
  timeout: 10s         # Wait max 10 seconds for response
  retries: 5           # Try 5 times before marking unhealthy
  start_period: 60s    # Wait 60 seconds after start before checking
```

**What it checks**:
- ✅ Strapi HTTP server is responding
- ✅ Application has fully initialized
- ✅ Database connection is working

**Manual test**:
```bash
# Check Strapi health
curl http://localhost:1337/_health
# Should return: {"status":"ok"}

# Or from within container
docker compose exec strapi wget -qO- http://localhost:1337/_health
```

**Why 60s start period**: Strapi takes 30-60 seconds to:
- Initialize the application
- Connect to database
- Load plugins and configurations
- Build admin panel (if needed)

### 2. Web (Nginx)

**Health Check**: HTTP request to root path

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/"]
  interval: 30s        # Check every 30 seconds
  timeout: 10s         # Wait max 10 seconds for response
  retries: 3           # Try 3 times before marking unhealthy
  start_period: 10s    # Wait 10 seconds after start before checking
```

**What it checks**:
- ✅ Nginx is running
- ✅ Can serve static files
- ✅ Configuration is valid

**Manual test**:
```bash
# Check web server
curl -I http://localhost:8081
# Should return: HTTP/1.1 200 OK

# Or from within container
docker compose exec web wget -qO- http://localhost:80/
```

**Dependency**: Web waits for Strapi to be healthy before starting

```yaml
depends_on:
  strapi:
    condition: service_healthy
```

### 3. Cloudflared (Tunnel)

**Health Check**: Check if process is running

```yaml
healthcheck:
  test: ["CMD-SHELL", "pidof cloudflared || exit 1"]
  interval: 60s        # Check every 60 seconds
  timeout: 10s         # Wait max 10 seconds for response
  retries: 3           # Try 3 times before marking unhealthy
  start_period: 20s    # Wait 20 seconds after start before checking
```

**What it checks**:
- ✅ Cloudflared process is running
- ✅ Tunnel hasn't crashed

**Manual test**:
```bash
# Check if cloudflared is running
pidof cloudflared
# Should return: process ID (e.g., 12345)

# Check tunnel status
docker compose logs cloudflared | grep -i "connection\|registered"
```

**Why longer interval**: Cloudflare tunnel is stable and doesn't need frequent checks

## Health Check Parameters Explained

### `test`
The command to run to check health. Returns:
- Exit code 0 = healthy
- Exit code 1 = unhealthy

### `interval`
How often to run the health check after the container is running.

### `timeout`
Maximum time to wait for the health check to complete.

### `retries`
Number of consecutive failures needed before marking unhealthy.

### `start_period`
Grace period after container start before health checks count toward retries. Allows time for initialization.

## Viewing Health Status

### Docker Compose

```bash
cd ~/petstar-website/docker

# View all services with health status
docker compose ps

# View detailed health info
docker compose ps --format json | jq '.[].Health'

# View health check logs
docker inspect petstar-strapi --format='{{json .State.Health}}' | jq
```

### Individual Service Health

```bash
# Strapi health
docker compose exec strapi wget -qO- http://localhost:1337/_health

# Web health
docker compose exec web wget -qO- http://localhost:80/

# Cloudflared health
docker compose exec cloudflared pidof cloudflared
```

## Automatic Restart on Failure

Docker/Podman automatically restarts containers when:

1. **Health check fails** `retries` times consecutively
2. **Container crashes** (due to `restart: unless-stopped`)

### Restart Policy

```yaml
restart: unless-stopped
```

This means:
- ✅ Restart on failure
- ✅ Restart on Docker/Podman daemon restart
- ❌ Don't restart if manually stopped (`docker compose stop`)

## Monitoring Health Checks

### Real-time Monitoring

```bash
# Watch health status in real-time
watch -n 2 'docker compose ps'

# Or with color
watch -n 2 'docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"'
```

### Check Health History

```bash
# View health check results
docker inspect petstar-strapi | jq '.[0].State.Health'

# Output shows:
{
  "Status": "healthy",
  "FailingStreak": 0,
  "Log": [
    {
      "Start": "2025-01-05T10:30:00Z",
      "End": "2025-01-05T10:30:01Z",
      "ExitCode": 0,
      "Output": ""
    }
  ]
}
```

### Alert on Unhealthy

Create a simple monitoring script:

```bash
#!/bin/bash
# save as: monitor-health.sh

cd ~/petstar-website/docker

while true; do
    UNHEALTHY=$(docker compose ps --format json | jq -r '.[] | select(.Health != "healthy") | .Name')

    if [ ! -z "$UNHEALTHY" ]; then
        echo "⚠️  Unhealthy services detected: $UNHEALTHY"
        # Send notification (email, slack, etc.)
    fi

    sleep 60
done
```

## Troubleshooting Health Checks

### Strapi Marked as Unhealthy

**Check logs**:
```bash
docker compose logs strapi --tail=50
```

**Common causes**:
1. Database corruption
2. Port already in use
3. Configuration error
4. Out of memory

**Solution**:
```bash
# Restart Strapi
docker compose restart strapi

# Or regenerate if corrupted
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

### Web (Nginx) Marked as Unhealthy

**Check logs**:
```bash
docker compose logs web --tail=50
```

**Common causes**:
1. Invalid nginx configuration
2. Missing files
3. Port conflict

**Solution**:
```bash
# Test nginx config
docker compose exec web nginx -t

# Restart web
docker compose restart web
```

### Cloudflared Marked as Unhealthy

**Check logs**:
```bash
docker compose logs cloudflared --tail=50
```

**Common causes**:
1. Invalid tunnel token
2. Network connectivity issues
3. Cloudflare service issues

**Solution**:
```bash
# Check tunnel token
docker compose config | grep TUNNEL_TOKEN

# Restart tunnel
docker compose restart cloudflared

# Check Cloudflare dashboard
# Visit: https://dash.cloudflare.com
```

### Health Check Takes Too Long

If health checks consistently timeout:

**Increase timeout**:
```yaml
healthcheck:
  timeout: 20s  # Increase from 10s
```

**Increase start period**:
```yaml
healthcheck:
  start_period: 90s  # Increase from 60s
```

### Too Many False Positives

If services are marked unhealthy but work fine:

**Increase retries**:
```yaml
healthcheck:
  retries: 10  # Increase from 5
```

**Increase interval**:
```yaml
healthcheck:
  interval: 60s  # Increase from 30s
```

## Benefits of Health Checks

### 1. Automatic Recovery
Services automatically restart if they become unhealthy.

### 2. Dependency Management
`depends_on` with `condition: service_healthy` ensures services start in correct order.

### 3. Load Balancer Integration
Load balancers can remove unhealthy instances from rotation (if using orchestration).

### 4. Monitoring Integration
External monitoring tools can query health status.

### 5. Debugging
Health check logs help identify when and why services fail.

## Best Practices

### 1. Set Appropriate Intervals
- Critical services: 30s
- Stable services: 60s
- Resource-intensive checks: 120s

### 2. Allow Sufficient Start Time
- Fast services (nginx): 10s
- Medium services (node apps): 30s
- Slow services (Strapi): 60s

### 3. Don't Over-Retry
Too many retries delay recovery. 3-5 retries is usually good.

### 4. Use Meaningful Health Checks
- ✅ Check actual functionality (HTTP endpoint)
- ❌ Just check if process exists

### 5. Monitor Health Check Performance
Health checks themselves consume resources. Don't make them too frequent or expensive.

## Integration with Makefile

The Makefile includes a `status` target that shows health:

```bash
cd ~/petstar-website/docker
make status
```

Output:
```
=== Container Status ===
NAME                 STATUS              HEALTH
petstar-web          Up 5 minutes        healthy
petstar-strapi       Up 5 minutes        healthy
petstar-cloudflared  Up 5 minutes        healthy

=== Strapi Health ===
{"status":"ok"}

=== Web Server Status ===
HTTP/1.1 200 OK
```

## Advanced: Custom Health Checks

### Add Custom Endpoint Health Check

For Strapi, you could check a specific API endpoint:

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget -qO- http://localhost:1337/api/articles | grep -q '\"data\"' || exit 1"]
```

### Check Database Connectivity

```yaml
healthcheck:
  test: ["CMD-SHELL", "test -f /opt/app/.tmp/data.db && sqlite3 /opt/app/.tmp/data.db 'SELECT 1;' || exit 1"]
```

### Check Disk Space

```yaml
healthcheck:
  test: ["CMD-SHELL", "df -h / | awk 'NR==2 {if (substr($5,1,length($5)-1)+0 > 90) exit 1; else exit 0}'"]
```

## Health Check in Production

### Monitor with External Tools

**Uptime Kuma**: Self-hosted monitoring
```bash
# Add HTTP monitors for:
# - https://api.petstar-dash.ro/_health
# - https://petstar.ro
```

**UptimeRobot**: Free external monitoring
- Monitor each public URL
- Get alerts on downtime

**Prometheus + Grafana**: Advanced monitoring
```yaml
# Add Prometheus exporter for container metrics
```

### Alerting

Set up alerts for unhealthy services:

**Email Alert**:
```bash
# Add to crontab
*/5 * * * * /home/user/check-health.sh
```

**Slack Webhook**:
```bash
if [ "$HEALTH" != "healthy" ]; then
    curl -X POST $SLACK_WEBHOOK -d '{"text":"Service unhealthy!"}'
fi
```

## Summary

| Service | Health Check | Interval | Start Period | Purpose |
|---------|--------------|----------|--------------|---------|
| **Strapi** | HTTP /_health | 30s | 60s | Ensure API is responding |
| **Web** | HTTP / | 30s | 10s | Ensure nginx serving files |
| **Cloudflared** | Process check | 60s | 20s | Ensure tunnel is running |

All services have:
- ✅ Automatic restart on failure
- ✅ Proper startup order (web waits for Strapi)
- ✅ Grace period for initialization
- ✅ Multiple retries before marking unhealthy

---

**Quick Reference**:
```bash
# View health status
docker compose ps

# View health logs
docker inspect <container> --format='{{json .State.Health}}' | jq

# Manual health check
curl http://localhost:1337/_health
curl http://localhost:8081
```
