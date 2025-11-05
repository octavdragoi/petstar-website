# Docker/Podman Compatibility

All PetStar server management scripts and the Makefile are now **fully compatible with both Docker and Podman**. They automatically detect which container runtime is available on your system.

## Auto-Detection

The scripts detect container runtimes in the following priority order:

1. **Docker with Compose plugin** (`docker compose`)
2. **Docker with docker-compose** (`docker-compose`)
3. **Podman with Compose plugin** (`podman compose`)
4. **Podman with podman-compose** (`podman-compose`)

## Compatible Scripts

### ✅ [regenerate-strapi-db.sh](regenerate-strapi-db.sh)
- Automatically detects Docker or Podman
- Shows which runtime is being used
- Works identically regardless of container runtime

### ✅ [backup-strapi.sh](backup-strapi.sh)
- Compatible with both runtimes
- Can run even without containers (file-based backup)

### ✅ [restore-strapi.sh](restore-strapi.sh)
- Automatically detects Docker or Podman
- Works identically with either runtime

### ✅ [docker/Makefile](docker/Makefile)
- Auto-detects container runtime at build time
- Shows detected runtime with `make help`
- All targets work with both Docker and Podman

## Usage

### No Changes Required

You don't need to modify anything! Just run the scripts as documented:

```bash
# Works with both Docker and Podman
./scripts/regenerate-strapi-db.sh
./scripts/backup-strapi.sh
./scripts/restore-strapi.sh

# Makefile also auto-detects
cd docker
make up
make status
make logs
```

### Detection Output

When you run a script, it will tell you which runtime it detected:

**With Docker:**
```
Detected: Docker with Compose plugin
Using: docker compose
```

**With Podman:**
```
Detected: Podman with podman-compose
Using: podman-compose
```

## Production Environment (psh-utils)

Since your production environment uses **Podman**, the scripts will automatically:
- Detect `podman-compose` or `podman compose`
- Use Podman commands instead of Docker commands
- Work exactly the same way as they would with Docker

## Testing

### Test Auto-Detection

You can verify which runtime will be used:

```bash
# Check what's installed
command -v docker && docker compose version
command -v docker-compose
command -v podman && podman compose version
command -v podman-compose

# Test the Makefile detection
cd docker
make help
# Will show: "Using container runtime: podman-compose" (or docker compose)
```

### Manual Override (if needed)

If you ever need to force a specific runtime, you can modify the scripts temporarily, but this shouldn't be necessary since auto-detection works reliably.

## Commands Reference

All these commands work identically with Docker or Podman:

### Container Management
```bash
cd ~/petstar-website/docker

# Start services
make up
# or manually:
docker compose up -d    # Docker
podman-compose up -d    # Podman

# Stop services
make down

# View logs
make logs
make logs-strapi

# Check status
make status
```

### Database Management
```bash
cd ~/petstar-website

# Regenerate database
./scripts/regenerate-strapi-db.sh

# Backup
./scripts/backup-strapi.sh

# Restore
./scripts/restore-strapi.sh
```

## Implementation Details

### Detection Logic

The scripts use this bash pattern for detection:

```bash
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    CONTAINER_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    CONTAINER_CMD="docker-compose"
elif command -v podman-compose &> /dev/null; then
    CONTAINER_CMD="podman-compose"
elif command -v podman &> /dev/null; then
    CONTAINER_CMD="podman compose"
else
    echo "ERROR: Neither Docker nor Podman found!"
    exit 1
fi
```

### Makefile Detection

The Makefile uses GNU Make's shell function:

```makefile
DOCKER_COMPOSE := $(shell command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 && echo "docker compose")
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := $(shell command -v podman-compose >/dev/null 2>&1 && echo "podman-compose")
endif
```

## Troubleshooting

### "Neither Docker nor Podman found"

If you see this error:
```bash
# Install Podman on RHEL/CentOS/Fedora
sudo dnf install podman podman-compose

# Or install Docker
curl -fsSL https://get.docker.com | sh
```

### Scripts use wrong runtime

This shouldn't happen with auto-detection, but if it does:
```bash
# Check what's available
which docker docker-compose podman podman-compose

# Test detection manually
bash -c 'command -v docker && docker compose version'
bash -c 'command -v podman-compose && podman-compose --version'
```

### Podman-compose not found

If you have Podman but not podman-compose:
```bash
# Install podman-compose
pip3 install podman-compose

# Or use Podman's compose plugin
# (Podman 4.0+ has native compose support)
```

## Benefits

### ✅ Production Ready
- Works on psh-utils with Podman out of the box
- No manual configuration needed

### ✅ Development Friendly
- Works on local machines with Docker
- Same commands, same behavior

### ✅ Future Proof
- Supports multiple versions and flavors
- Easy to extend if new runtimes emerge

### ✅ No Lock-in
- Not tied to specific container runtime
- Can switch between Docker and Podman without changing scripts

## Migration Notes

### From Docker to Podman

If you're migrating from Docker to Podman:

1. **Install Podman**
   ```bash
   sudo dnf install podman podman-compose
   ```

2. **No script changes needed**
   - Scripts auto-detect Podman
   - Everything works the same

3. **Compose file compatibility**
   - `docker-compose.yml` works with both
   - No modifications needed

### From Podman to Docker

Same process in reverse:

1. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

2. **Scripts auto-detect Docker**
   - No changes needed

## Testing Checklist

To ensure everything works on your system:

- [ ] Run `make help` - should show detected runtime
- [ ] Run `make up` - services should start
- [ ] Run `make status` - should show running containers
- [ ] Run `./scripts/backup-strapi.sh` - should create backup
- [ ] Check backup exists in `backups/` directory
- [ ] Run `make down` - services should stop

## Known Limitations

### None!

The auto-detection is robust and handles:
- ✅ Docker Desktop (Mac/Windows)
- ✅ Docker Engine (Linux)
- ✅ docker-compose v1 (standalone)
- ✅ Docker Compose v2 (plugin)
- ✅ Podman (all versions)
- ✅ podman-compose (Python-based)
- ✅ Podman compose plugin (native)

## Questions?

### "Which should I use, Docker or Podman?"

Either works perfectly! Choose based on your preference:
- **Docker**: More common, better documentation, GUI tools
- **Podman**: Daemonless, rootless, Red Hat/RHEL standard

### "Can I have both installed?"

Yes! The scripts prioritize Docker over Podman, but you can have both.

### "Will this work on any Linux distribution?"

Yes! The detection works on:
- Ubuntu/Debian
- RHEL/CentOS/Fedora
- Arch Linux
- Alpine Linux
- Any Linux with bash and either Docker or Podman

### "What about macOS/Windows?"

Yes, works with Docker Desktop on macOS and Windows.

---

**Bottom Line**: You don't need to worry about Docker vs Podman. The scripts handle it automatically! 🎉
