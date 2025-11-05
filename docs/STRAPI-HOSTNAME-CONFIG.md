# Strapi Hostname Configuration

## The Problem

When accessing Strapi through a custom domain (like `https://petstar-dash.ro` or `https://api.petstar-dash.ro`), you may see errors like:

```
Blocked request. This host ("api.petstar-dash.ro") is not allowed.
To allow this host, add "api.petstar-dash.ro" to `server.allowedHosts` in vite.config.js.
```

This happens because Strapi's security middleware needs to know which hostnames are trusted.

## The Solution

The PetStar Strapi installation is now pre-configured to work with these hostnames:

- ✅ `petstar-dash.ro` - Main Strapi admin dashboard
- ✅ `api.petstar-dash.ro` - API subdomain (if used)
- ✅ `localhost:1337` - Local development

### Configuration Files

The following files have been configured:

#### 1. Environment Variables (`.env`)

**Location**: `petstar-cms/.env`

```bash
HOST=0.0.0.0
PORT=1337

# Public URL Configuration
URL=https://petstar-dash.ro
SERVER_URL=https://petstar-dash.ro
```

These variables tell Strapi what its public URL is.

#### 2. Server Configuration

**Location**: `petstar-cms/config/server.ts`

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

The `url` field is read from the `URL` environment variable.

#### 3. Admin Configuration

**Location**: `petstar-cms/config/admin.ts`

```typescript
export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  url: env('URL', '/admin'),
  serveAdminPanel: env.bool('SERVE_ADMIN', true),
  autoOpen: false,
  // ... other config
});
```

#### 4. Middleware Configuration (Security)

**Location**: `petstar-cms/config/middlewares.ts`

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://petstar-dash.ro',
            'https://api.petstar-dash.ro',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://petstar-dash.ro',
            'https://api.petstar-dash.ro',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ... other middlewares
];
```

This configures Content Security Policy (CSP) to allow your domains.

## Using Different Domains

### For Production

If your production domain is different, update the `.env` file:

```bash
URL=https://your-domain.com
SERVER_URL=https://your-domain.com
```

And update `petstar-cms/config/middlewares.ts` to include your domain:

```typescript
'img-src': [
  "'self'",
  'data:',
  'blob:',
  'dl.airtable.com',
  'https://your-domain.com',
  'https://api.your-domain.com',
],
```

### For Local Development

The default configuration works for local development:

```bash
URL=http://localhost:1337
SERVER_URL=http://localhost:1337
```

### For Multiple Environments

Create different `.env` files:

- `.env.local` - Local development
- `.env.staging` - Staging server
- `.env.production` - Production server

Copy the appropriate one when deploying.

## Automatic Configuration

The `regenerate-strapi-db.sh` script automatically sets these URLs:

```bash
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

It will create a `.env` file with:
- `URL=https://petstar-dash.ro`
- `SERVER_URL=https://petstar-dash.ro`

## Manual Configuration

If you need to manually update the hostname:

### 1. Update `.env` file

```bash
cd ~/petstar-website/petstar-cms
nano .env
```

Change:
```bash
URL=https://your-new-domain.com
SERVER_URL=https://your-new-domain.com
```

### 2. Update Middleware Configuration

```bash
cd ~/petstar-website/petstar-cms/config
nano middlewares.ts
```

Add your domain to the CSP directives.

### 3. Restart Strapi

```bash
cd ~/petstar-website/docker
podman-compose restart strapi
```

## Troubleshooting

### Still Getting "Blocked request" Errors

1. **Clear browser cache**: The CSP headers may be cached
   ```bash
   # Chrome/Firefox: Ctrl+Shift+Delete, clear cache
   ```

2. **Check Strapi logs**:
   ```bash
   cd ~/petstar-website/docker
   podman-compose logs -f strapi | grep -i "host\|blocked"
   ```

3. **Verify environment variables are loaded**:
   ```bash
   cd ~/petstar-website/docker
   podman-compose exec strapi env | grep URL
   ```

4. **Rebuild Strapi admin panel**:
   ```bash
   cd ~/petstar-website/petstar-cms
   npm run build
   cd ~/petstar-website/docker
   podman-compose restart strapi
   ```

### CORS Errors

If you're getting CORS errors in addition to hostname errors, check the `docker-compose.yml`:

```yaml
strapi:
  environment:
    - STRAPI_CORS_ENABLED=true
    - STRAPI_CORS_ORIGIN=http://localhost:1337,http://localhost:8081,https://petstar.ro,https://petstar-dash.ro
```

Add your domain to `STRAPI_CORS_ORIGIN`.

### Assets Not Loading

If images or media files aren't loading:

1. Check the `middlewares.ts` CSP configuration includes your domain in `img-src` and `media-src`
2. Check file permissions on `petstar-cms/public/uploads`
3. Verify Cloudflare tunnel is routing correctly

## CORS vs CSP vs Allowed Hosts

Understanding the difference:

### CORS (Cross-Origin Resource Sharing)
- Controls which **origins** can make API requests to Strapi
- Configured in `docker-compose.yml` environment variables
- Error: "Access to fetch at ... has been blocked by CORS policy"

### CSP (Content Security Policy)
- Controls which **sources** the admin panel can load resources from
- Configured in `middlewares.ts`
- Error: "Refused to load ... because it violates the CSP directive"

### Allowed Hosts
- Controls which **hostnames** can access the Strapi admin
- Configured via `URL` in `.env` and server configuration
- Error: "This host is not allowed"

All three need to be configured for Strapi to work with custom domains!

## Security Notes

### Why These Settings?

1. **`upgradeInsecureRequests: null`**: Disables automatic HTTP→HTTPS upgrade
   - Allows local development with HTTP
   - Cloudflare tunnel handles HTTPS in production

2. **`'connect-src': ["'self'", 'https:']`**: Allows HTTPS connections
   - Required for API calls to work
   - More permissive but necessary for Strapi admin

3. **Specific domain whitelisting**: Only allows trusted domains
   - Your domains (`petstar-dash.ro`, etc.)
   - Essential services (`dl.airtable.com` for Strapi marketplace)

### Production Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Specific domains**: List only the domains you control
3. **Regular updates**: Keep Strapi and dependencies updated
4. **Environment variables**: Never commit `.env` files
5. **Restrict CORS**: Only allow necessary origins

## Quick Reference

### Production Setup Checklist

- [ ] Set `URL=https://your-domain.com` in `.env`
- [ ] Set `SERVER_URL=https://your-domain.com` in `.env`
- [ ] Add domain to `middlewares.ts` CSP directives
- [ ] Add domain to `docker-compose.yml` CORS origins
- [ ] Restart Strapi: `podman-compose restart strapi`
- [ ] Clear browser cache
- [ ] Test admin panel access
- [ ] Test API access
- [ ] Test image/media loading

### Environment Variables Summary

```bash
# Required
URL=https://petstar-dash.ro
SERVER_URL=https://petstar-dash.ro

# Optional but recommended
STRAPI_CORS_ENABLED=true
STRAPI_CORS_ORIGIN=https://petstar.ro,https://petstar-dash.ro

# Other required vars
HOST=0.0.0.0
PORT=1337
APP_KEYS=...
# etc.
```

## Resources

- [Strapi Server Configuration](https://docs.strapi.io/dev-docs/configurations/server)
- [Strapi Admin Panel Configuration](https://docs.strapi.io/dev-docs/configurations/admin-panel)
- [Strapi Middlewares](https://docs.strapi.io/dev-docs/configurations/middlewares)
- [Content Security Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**TL;DR**: The configuration is already done! Just run `./scripts/regenerate-strapi-db.sh` and it will set everything up correctly for `petstar-dash.ro`. 🎉
