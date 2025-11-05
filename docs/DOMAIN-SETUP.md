# PetStar Domain Setup Guide

## Architecture Overview

The PetStar infrastructure uses **separate subdomains** for different services:

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Tunnel                         │
└──────────────┬──────────────────────┬────────────────────────┘
               │                      │
               ▼                      ▼
    petstar-dash.ro          api.petstar-dash.ro
    ┌──────────────┐         ┌──────────────────────┐
    │   Dashboard  │         │    Strapi CMS        │
    │   Website    │◄────────│  - Admin Panel       │
    │              │  API    │  - REST API          │
    └──────────────┘         │  - GraphQL API       │
                             └──────────────────────┘
```

### Domain Mapping

| Domain | Service | Purpose |
|--------|---------|---------|
| **petstar-dash.ro** | Dashboard Website | Custom admin dashboard/website |
| **api.petstar-dash.ro** | Strapi CMS | Content management and API |
| petstar.ro | Public Website | Main public-facing website |

## Benefits of This Setup

### 1. **Separation of Concerns**
- Dashboard UI and API backend are independent
- Can deploy/update each service separately
- Clear API boundaries

### 2. **Security**
- API has its own subdomain with specific CORS rules
- Easier to apply rate limiting per subdomain
- Cleaner SSL certificate management

### 3. **Scalability**
- Can scale API and dashboard independently
- Can add CDN for dashboard while keeping API direct
- Easier to implement microservices later

### 4. **Development**
- Frontend devs can work on dashboard independently
- API documentation is clearly at api.petstar-dash.ro/api
- Cleaner URL structure

## Configuration

### Strapi Configuration

**Environment Variables** (`.env`):
```bash
URL=https://api.petstar-dash.ro
SERVER_URL=https://api.petstar-dash.ro
```

**CORS Origins** ([docker-compose.yml](../docker/docker-compose.yml)):
```yaml
environment:
  - STRAPI_CORS_ORIGIN=https://petstar-dash.ro,https://api.petstar-dash.ro
```

**CSP Configuration** ([middlewares.ts](../petstar-cms/config/middlewares.ts)):
```typescript
directives: {
  'img-src': [
    'https://petstar-dash.ro',      // Dashboard domain
    'https://api.petstar-dash.ro',  // API domain
  ],
}
```

### Cloudflare Tunnel Configuration

You'll need to configure your Cloudflare tunnel to route:

```yaml
# Example cloudflared config
ingress:
  # Dashboard website
  - hostname: petstar-dash.ro
    service: http://localhost:3000  # Your dashboard app

  # Strapi CMS
  - hostname: api.petstar-dash.ro
    service: http://localhost:1337  # Strapi

  # Public website
  - hostname: petstar.ro
    service: http://localhost:8081  # Static site

  # Catch-all
  - service: http_status:404
```

## URL Structure

### api.petstar-dash.ro (Strapi)

| Endpoint | URL | Purpose |
|----------|-----|---------|
| Admin Panel | https://api.petstar-dash.ro/admin | Strapi admin dashboard |
| REST API | https://api.petstar-dash.ro/api | Content API |
| GraphQL API | https://api.petstar-dash.ro/graphql | GraphQL endpoint |
| Upload | https://api.petstar-dash.ro/uploads | Media files |
| Health Check | https://api.petstar-dash.ro/_health | Service health |

### petstar-dash.ro (Dashboard)

Your custom dashboard website. Can be:
- React/Vue/Angular SPA
- Next.js/Nuxt application
- Static HTML dashboard
- Custom admin interface

This dashboard would make API calls to `api.petstar-dash.ro/api`

### petstar.ro (Public Site)

The main public-facing website (already configured).

## Implementation Steps

### 1. Update Local Configuration

This is already done! The regenerate script now sets:
```bash
URL=https://api.petstar-dash.ro
SERVER_URL=https://api.petstar-dash.ro
```

### 2. Configure Cloudflare Tunnel

In your Cloudflare dashboard:

1. Go to **Zero Trust** > **Access** > **Tunnels**
2. Edit your tunnel
3. Add public hostnames:
   - `api.petstar-dash.ro` → `http://localhost:1337`
   - `petstar-dash.ro` → `http://localhost:3000` (or your dashboard port)

### 3. Deploy to Server

```bash
# Copy files to server
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ psh-utils:~/petstar-website/

# SSH to server
ssh psh-utils

# Regenerate Strapi with new URLs
cd ~/petstar-website
./scripts/regenerate-strapi-db.sh
```

### 4. Verify Configuration

```bash
# Check Strapi is accessible
curl https://api.petstar-dash.ro/_health

# Check admin panel
open https://api.petstar-dash.ro/admin

# Check API
curl https://api.petstar-dash.ro/api
```

## Dashboard Website Setup

For the dashboard at `petstar-dash.ro`, you have several options:

### Option 1: React/Vue Dashboard

Create a separate dashboard app:

```bash
# Create new dashboard project
npx create-react-app petstar-dashboard
cd petstar-dashboard

# Install axios for API calls
npm install axios

# Configure API base URL
# .env
REACT_APP_API_URL=https://api.petstar-dash.ro/api
```

### Option 2: Next.js Dashboard

```bash
npx create-next-app@latest petstar-dashboard
cd petstar-dashboard

# Configure API
# .env.local
NEXT_PUBLIC_API_URL=https://api.petstar-dash.ro/api
```

### Option 3: Static HTML + JavaScript

Simple approach using vanilla JS:

```html
<!DOCTYPE html>
<html>
<head>
    <title>PetStar Dashboard</title>
</head>
<body>
    <div id="dashboard"></div>
    <script>
        const API_URL = 'https://api.petstar-dash.ro/api';

        // Fetch data from Strapi
        fetch(`${API_URL}/articles`)
            .then(res => res.json())
            .then(data => {
                // Display data
                console.log(data);
            });
    </script>
</body>
</html>
```

### Option 4: Use Strapi Admin Panel

Simply use Strapi's built-in admin panel at `api.petstar-dash.ro/admin` - no custom dashboard needed!

## API Usage Examples

### Fetch Content from Dashboard

**JavaScript (Fetch API):**
```javascript
const API_URL = 'https://api.petstar-dash.ro/api';

// Get all articles
fetch(`${API_URL}/articles?populate=*`)
  .then(res => res.json())
  .then(data => console.log(data));

// Get single article
fetch(`${API_URL}/articles/1?populate=*`)
  .then(res => res.json())
  .then(data => console.log(data));
```

**With Authentication:**
```javascript
const API_TOKEN = 'your_api_token_here';

fetch(`${API_URL}/articles`, {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

**Axios:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.petstar-dash.ro/api',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

// Get articles
const articles = await api.get('/articles?populate=*');
console.log(articles.data);
```

## DNS Configuration

In your DNS provider (or Cloudflare DNS):

```
Type    Name                    Value
────────────────────────────────────────────────
CNAME   petstar-dash.ro         your-tunnel.cfargotunnel.com
CNAME   api.petstar-dash.ro     your-tunnel.cfargotunnel.com
CNAME   petstar.ro              your-tunnel.cfargotunnel.com
```

Or if using Cloudflare tunnel, it handles DNS automatically.

## Testing

### Test API Endpoint

```bash
# Health check
curl https://api.petstar-dash.ro/_health

# API endpoint
curl https://api.petstar-dash.ro/api

# Admin panel (in browser)
open https://api.petstar-dash.ro/admin
```

### Test CORS

```javascript
// From your dashboard website
fetch('https://api.petstar-dash.ro/api/articles')
  .then(res => res.json())
  .then(data => console.log('CORS working!', data))
  .catch(err => console.error('CORS error:', err));
```

### Test CSP

Upload an image in Strapi admin panel and verify it displays correctly.

## Security Considerations

### 1. API Token Management

Generate API tokens in Strapi admin:
- Go to **Settings** > **API Tokens**
- Create tokens with appropriate permissions
- Store tokens securely (environment variables, never in code)

### 2. CORS Configuration

Already configured for:
- ✅ `https://petstar-dash.ro` - Dashboard can call API
- ✅ `https://api.petstar-dash.ro` - API can call itself
- ✅ `https://petstar.ro` - Public site can call API

Add more origins in [docker-compose.yml](../docker/docker-compose.yml) if needed.

### 3. Rate Limiting

Consider adding rate limiting at Cloudflare level:
- Limit API requests per IP
- DDoS protection
- Bot management

### 4. Authentication

For dashboard users:
- Use Strapi's built-in auth: `/api/auth/local`
- Or implement JWT authentication
- Or use OAuth providers

## Troubleshooting

### CORS Errors

**Error**: "Access to fetch has been blocked by CORS policy"

**Solution**: Add your dashboard domain to CORS origins:
```yaml
# docker-compose.yml
STRAPI_CORS_ORIGIN=https://petstar-dash.ro,https://api.petstar-dash.ro
```

### Admin Panel Won't Load

**Error**: "Blocked request. This host is not allowed"

**Solution**: Verify `.env` has correct URL:
```bash
URL=https://api.petstar-dash.ro
```

### API Returns 404

**Error**: API endpoints return 404

**Solution**:
1. Check Strapi is running: `curl https://api.petstar-dash.ro/_health`
2. Verify content types are published
3. Check API permissions in Strapi admin

### Images Won't Load

**Error**: Images from Strapi won't display

**Solution**: Check CSP in [middlewares.ts](../petstar-cms/config/middlewares.ts) includes your domains.

## Migration from Single Domain

If you're migrating from the old setup where everything was at `petstar-dash.ro`:

### 1. Update Environment Variables

Run the regenerate script (already configured):
```bash
./scripts/regenerate-strapi-db.sh
```

### 2. Update Frontend Code

Change API URLs in your dashboard:
```javascript
// Old
const API_URL = 'https://petstar-dash.ro/api';

// New
const API_URL = 'https://api.petstar-dash.ro/api';
```

### 3. Update Cloudflare Tunnel

Add the new `api.petstar-dash.ro` hostname routing to port 1337.

### 4. Test Thoroughly

Verify all API calls work from the dashboard.

## Quick Reference

### URLs

| Service | URL |
|---------|-----|
| Dashboard | https://petstar-dash.ro |
| Strapi Admin | https://api.petstar-dash.ro/admin |
| API | https://api.petstar-dash.ro/api |
| Public Site | https://petstar.ro |

### Ports (Local)

| Service | Port |
|---------|------|
| Dashboard | 3000 (or your choice) |
| Strapi | 1337 |
| Public Site | 8081 |

### Configuration Files

| File | Purpose |
|------|---------|
| `petstar-cms/.env` | Strapi environment variables |
| `docker/docker-compose.yml` | CORS configuration |
| `petstar-cms/config/middlewares.ts` | CSP configuration |
| `petstar-cms/config/server.ts` | Server URL configuration |

---

**Need Help?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.
