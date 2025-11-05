# Fixing Vite "Blocked request" Error

## The Problem

When accessing Strapi through a custom domain (like `api.petstar-dash.ro`), you might see:

```
Blocked request. This host ("api.petstar-dash.ro") is not allowed.
To allow this host, add "api.petstar-dash.ro" to `server.allowedHosts` in vite.config.js.
```

## Why This Happens

Strapi's admin panel uses **Vite** as its development server. Vite has a security feature that blocks requests from unknown hosts to prevent DNS rebinding attacks.

When you access Strapi via:
- ✅ `localhost:1337` → Works (default allowed)
- ❌ `api.petstar-dash.ro` → Blocked (not in allowedHosts)

## The Solution

### Already Fixed! ✅

The PetStar installation now includes the proper Vite configuration:

**File**: `petstar-cms/src/admin/vite.config.ts`

```typescript
import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    server: {
      host: true,
      hmr: {
        clientPort: 1337,
      },
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'api.petstar-dash.ro',
        'petstar-dash.ro',
      ],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
```

This configuration:
- ✅ Allows `api.petstar-dash.ro` (Strapi API domain)
- ✅ Allows `petstar-dash.ro` (Dashboard domain)
- ✅ Allows `localhost` and `127.0.0.1` (local development)
- ✅ Sets up HMR (Hot Module Replacement) for the admin panel

## Apply the Fix

### Option 1: Deploy Fresh (Recommended)

Simply deploy and rebuild:

```bash
# On server (psh-utils)
ssh psh-utils
cd ~/petstar-website

# Regenerate Strapi (includes new config)
./scripts/regenerate-strapi-db.sh
```

The regenerate script will:
1. Copy the new vite.config.ts
2. Rebuild the admin panel with correct settings
3. Start Strapi with allowed hosts configured

### Option 2: Rebuild Admin Panel Only

If you don't want to regenerate the database:

```bash
# On server
cd ~/petstar-website/petstar-cms

# Rebuild admin panel
npm run build

# Restart Strapi
cd ~/petstar-website/docker
podman-compose restart strapi
```

### Option 3: Manual File Copy

If the file is missing:

```bash
# Copy vite.config.ts to the server
scp petstar-cms/src/admin/vite.config.ts \
    psh-utils:~/petstar-website/petstar-cms/src/admin/

# SSH to server
ssh psh-utils
cd ~/petstar-website/petstar-cms

# Rebuild
npm run build

# Restart
cd ~/petstar-website/docker
podman-compose restart strapi
```

## Verification

### 1. Check Config File Exists

```bash
cat ~/petstar-website/petstar-cms/src/admin/vite.config.ts
```

Should show the configuration with `allowedHosts`.

### 2. Test Admin Panel Access

```bash
# Should work now
curl -I https://api.petstar-dash.ro/admin

# Should return 200 OK
```

### 3. Test in Browser

Open: https://api.petstar-dash.ro/admin

- ✅ Should load without "Blocked request" error
- ✅ Admin panel should display correctly
- ✅ HMR should work for development

## Adding More Domains

If you need to add additional domains in the future:

**Edit**: `petstar-cms/src/admin/vite.config.ts`

```typescript
allowedHosts: [
  'localhost',
  '127.0.0.1',
  'api.petstar-dash.ro',
  'petstar-dash.ro',
  'your-new-domain.com',  // Add here
],
```

Then rebuild:
```bash
npm run build
podman-compose restart strapi
```

## Understanding the Configuration

### `server.host: true`
Allows Vite to listen on all network interfaces (0.0.0.0), not just localhost.

### `hmr.clientPort: 1337`
Sets the port for Hot Module Replacement. Must match your Strapi port.

### `allowedHosts`
List of hostnames that can access the Vite dev server. Protects against DNS rebinding attacks.

### `resolve.alias`
Creates an alias `@` that points to `/src` for cleaner imports.

## Related Configuration

The Vite config works together with other Strapi configurations:

### 1. Server Config (`config/server.ts`)
```typescript
url: env('URL', 'http://localhost:1337')
```
Tells Strapi what its public URL is.

### 2. Admin Config (`config/admin.ts`)
```typescript
url: env('URL', '/admin')
host: env('HOST', '0.0.0.0')
```
Configures the admin panel URL and host.

### 3. Middlewares (`config/middlewares.ts`)
```typescript
'img-src': ['https://api.petstar-dash.ro']
```
CSP (Content Security Policy) allows loading resources.

### 4. CORS (docker-compose.yml)
```yaml
STRAPI_CORS_ORIGIN=https://api.petstar-dash.ro
```
Allows cross-origin requests.

All four must be configured correctly!

## Troubleshooting

### Still Getting "Blocked request"

**1. Check if vite.config.ts exists:**
```bash
ls -la ~/petstar-website/petstar-cms/src/admin/vite.config.ts
```

**2. Verify it has correct content:**
```bash
grep "allowedHosts" ~/petstar-website/petstar-cms/src/admin/vite.config.ts
```

**3. Rebuild admin panel:**
```bash
cd ~/petstar-website/petstar-cms
npm run build
```

**4. Clear browser cache:**
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Or use incognito/private mode

**5. Check Strapi logs:**
```bash
cd ~/petstar-website/docker
podman-compose logs -f strapi | grep -i "vite\|host\|allowed"
```

### Admin Panel Loads but Features Don't Work

This might be an HMR (Hot Module Replacement) issue:

**1. Check HMR port:**
```typescript
hmr: {
  clientPort: 1337,  // Must match your Strapi port
}
```

**2. Check Cloudflare tunnel:**
Ensure WebSocket connections are allowed through the tunnel.

### Different Error: "Invalid Host header"

This is a different (but related) error from Nginx or other proxies.

**Solution**: Usually means your reverse proxy needs configuration, but since we're using Cloudflare tunnel, this shouldn't happen.

## Production vs Development

### Development Mode
Vite runs a dev server with HMR for faster development:
```bash
npm run develop
```

### Production Mode
Admin panel is built and served as static files:
```bash
npm run build
npm run start
```

In **production** (which you're using), the admin panel is pre-built, so Vite doesn't run. However, the `allowedHosts` configuration is still needed during the build process.

## Security Note

The `allowedHosts` configuration is a security feature to prevent:
- **DNS Rebinding Attacks**: Where an attacker tricks your browser into making requests to unexpected hosts
- **Unauthorized Access**: Only listed hosts can access the admin panel

Keep your `allowedHosts` list **as specific as possible**:
- ✅ List only your actual domains
- ❌ Don't use wildcards like `*.com`
- ❌ Don't disable the check entirely

## Quick Reference

### File Locations
```
petstar-cms/
├── src/
│   └── admin/
│       └── vite.config.ts          ← Vite configuration
├── config/
│   ├── server.ts                   ← Server URL
│   ├── admin.ts                    ← Admin panel config
│   └── middlewares.ts              ← CSP configuration
```

### Commands
```bash
# Check config exists
cat petstar-cms/src/admin/vite.config.ts

# Rebuild admin
cd petstar-cms && npm run build

# Restart Strapi
cd docker && podman-compose restart strapi

# View logs
podman-compose logs -f strapi
```

### URLs After Fix
- ✅ https://api.petstar-dash.ro/admin → Strapi admin panel
- ✅ https://api.petstar-dash.ro/api → REST API
- ✅ http://localhost:1337/admin → Local development

---

**TL;DR**: The vite.config.ts file is now included and configured. Just run `./scripts/regenerate-strapi-db.sh` on the server and it will work! 🎉
