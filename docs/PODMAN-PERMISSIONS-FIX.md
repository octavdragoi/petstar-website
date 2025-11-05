# Podman Permissions Quick Fix

## The Problem

When running Strapi with Podman (especially rootless Podman), you may encounter:

```
EACCES: permission denied, mkdir '/opt/app/database/migrations'
EACCES: permission denied, open '/opt/app/.tmp/data.db'
```

This happens because:
1. Podman runs containers as non-root by default
2. The container user ID doesn't match your host user ID
3. Mounted volumes don't have write permissions for the container user

## The Solution

### Quick Fix (Recommended)

Simply run the regenerate script - it handles everything automatically:

```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

The script will:
- ✅ Pre-create all required directories
- ✅ Set correct permissions (777 for Podman compatibility)
- ✅ Start containers with fresh database

### Manual Fix

If you just need to fix permissions without regenerating:

```bash
cd ~/petstar-website/petstar-cms

# Create directories if they don't exist
mkdir -p database/migrations .tmp public/uploads .cache

# Fix permissions
chmod -R 777 database .tmp public .cache

# Restart containers
cd ~/petstar-website/docker
podman-compose restart strapi
```

### One-Line Fix

```bash
cd ~/petstar-website/petstar-cms && mkdir -p database/migrations .tmp public/uploads .cache && chmod -R 777 database .tmp public .cache && cd ~/petstar-website/docker && podman-compose restart strapi
```

## Understanding the Fix

### Why 777 Permissions?

Setting `chmod 777` (rwxrwxrwx) means anyone can read, write, and execute. While this sounds unsafe, it's actually fine here because:

1. **User Namespace Isolation**: Podman provides user namespace isolation. Even with 777, only your user and the container can access these files.

2. **Limited Scope**: These permissions only apply to:
   - `database/` - Strapi database files
   - `.tmp/` - SQLite database file
   - `public/` - Uploaded media files
   - `.cache/` - Strapi cache

3. **Not System Files**: These are application data directories inside your project, not system files.

4. **Podman Rootless**: The container runs in your user's namespace, so it's isolated from other users.

### Alternative: More Restrictive Permissions

If you want more restrictive permissions, you can:

1. **Find the container UID**:
   ```bash
   podman inspect petstar-strapi | grep -A 5 '"UIDMap"'
   ```

2. **Set ownership to that UID**:
   ```bash
   # Example if container runs as UID 100999
   sudo chown -R 100999:100999 database .tmp public .cache
   chmod -R 755 database .tmp public .cache
   ```

3. **Or use Podman's automatic chown**:
   Add `U` flag to volumes in docker-compose.yml:
   ```yaml
   volumes:
     - ../petstar-cms/database:/opt/app/database:z,U
     - ../petstar-cms/.tmp:/opt/app/.tmp:z,U
   ```
   The `U` flag tells Podman to automatically set ownership.

## How the docker-compose.yml Helps

Our `docker-compose.yml` already has Podman-friendly settings:

```yaml
volumes:
  - ../petstar-cms/src:/opt/app/src:z
  - ../petstar-cms/config:/opt/app/config:z
  - ../petstar-cms/database:/opt/app/database:z
  - ../petstar-cms/public:/opt/app/public:z
  - ../petstar-cms/.tmp:/opt/app/.tmp:z
```

The `:z` suffix tells Podman to:
- Apply correct SELinux labels
- Allow container access to volumes
- Maintain security while enabling writes

## Prevention

To avoid this issue in the future:

### 1. Use the Regenerate Script
Always use `./scripts/regenerate-strapi-db.sh` when setting up or resetting.

### 2. Pre-create Directories
If deploying to a new server:
```bash
cd ~/petstar-website/petstar-cms
mkdir -p database/migrations .tmp public/uploads .cache
chmod -R 777 database .tmp public .cache
```

### 3. Add to Deployment Checklist
Make permission setup part of your deployment process.

## Troubleshooting

### Still Getting Errors?

1. **Check if directories exist**:
   ```bash
   ls -la ~/petstar-website/petstar-cms/{database,.tmp,public,.cache}
   ```

2. **Check permissions**:
   ```bash
   ls -ld ~/petstar-website/petstar-cms/{database,.tmp,public,.cache}
   ```
   Should show `drwxrwxrwx` (777)

3. **Check SELinux labels** (if SELinux is enabled):
   ```bash
   ls -Z ~/petstar-website/petstar-cms/{database,.tmp,public,.cache}
   ```
   Should show `container_file_t` or similar

4. **Check container logs**:
   ```bash
   cd ~/petstar-website/docker
   podman-compose logs strapi | grep -i "permission\|EACCES"
   ```

5. **Verify Podman user namespace**:
   ```bash
   podman unshare cat /proc/self/uid_map
   ```

### Nuclear Option

If nothing works, completely reset:

```bash
cd ~/petstar-website

# Stop containers
cd docker
podman-compose down

# Remove all Strapi data
cd ~/petstar-website/petstar-cms
rm -rf database .tmp .cache node_modules

# Run regenerate script
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

## Docker vs Podman

### Docker
Docker runs as root by default, so permission issues are less common. The daemon handles UID mapping automatically.

### Podman
Podman runs rootless by default, which is more secure but requires manual permission handling. This is why we set 777 permissions.

Our scripts detect which runtime you're using and work with both!

## References

- [Podman Rootless Documentation](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md)
- [Podman Volume Permissions](https://docs.podman.io/en/latest/markdown/podman-run.1.html#volume-v-source-volume-host-dir-container-dir-options)
- [SELinux and Container Labels](https://www.redhat.com/sysadmin/user-namespaces-selinux-rootless-containers)

---

**TL;DR**: Just run `./scripts/regenerate-strapi-db.sh` and it handles everything! 🎉
