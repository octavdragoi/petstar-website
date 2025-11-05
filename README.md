# PetStar Website

Official website and CMS for PetStar - Circular Economy in Plastic Recycling

## 🚀 Quick Start

### For Production Deployment

```bash
# SSH to server
ssh psh-utils

# Navigate to project
cd ~/petstar-website

# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Regenerate Strapi database with fresh keys
./scripts/regenerate-strapi-db.sh
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### For Local Development

```bash
# Start all services
cd docker
make up

# View logs
make logs

# Check status
make status
```

## 📁 Project Structure

```
petstar-website/
├── scripts/                          # Management scripts
│   ├── regenerate-strapi-db.sh      # Regenerate Strapi DB with fresh keys
│   ├── backup-strapi.sh             # Backup Strapi data
│   └── restore-strapi.sh            # Restore from backup
├── docs/                             # Documentation
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── TROUBLESHOOTING.md           # Troubleshooting guide
│   ├── QUICK-REFERENCE.md           # Quick reference cheat sheet
│   ├── SERVER-SCRIPTS-README.md     # Scripts documentation
│   └── DOCKER-PODMAN-COMPATIBILITY.md  # Container runtime docs
├── docker/                           # Docker/Podman configuration
│   ├── docker-compose.yml           # Services definition
│   ├── Makefile                     # Make targets for easy management
│   └── nginx.conf                   # Nginx configuration
├── petstar-cms/                      # Strapi CMS
│   ├── src/                         # Strapi source code
│   ├── config/                      # Strapi configuration
│   ├── .env                         # Strapi environment variables
│   └── ...
├── sections/                         # Website HTML sections
│   ├── section-01-header.html
│   ├── section-02-hero.html
│   └── ...
├── assets/                           # Website assets
│   ├── css/                         # Stylesheets
│   ├── js/                          # JavaScript files
│   └── images/                      # Images
├── index.html                        # Main website file
├── CLAUDE.md                         # Development guidelines
└── README.md                         # This file
```

## 🛠️ Management Scripts

### Regenerate Database
Create a fresh Strapi database with new secret keys:
```bash
./scripts/regenerate-strapi-db.sh
```

### Backup Data
Create a complete backup of Strapi data:
```bash
./scripts/backup-strapi.sh
```

### Restore from Backup
Restore Strapi from a previous backup:
```bash
./scripts/restore-strapi.sh
```

All scripts are **compatible with both Docker and Podman** and auto-detect the available container runtime.

## 📚 Documentation

- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete deployment guide
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[QUICK-REFERENCE.md](docs/QUICK-REFERENCE.md)** - One-page cheat sheet
- **[SERVER-SCRIPTS-README.md](docs/SERVER-SCRIPTS-README.md)** - Scripts documentation
- **[DOCKER-PODMAN-COMPATIBILITY.md](docs/DOCKER-PODMAN-COMPATIBILITY.md)** - Container runtime compatibility

## 🐳 Container Runtime

This project is **fully compatible with both Docker and Podman**. All scripts and the Makefile automatically detect which container runtime is available on your system.

- Production (psh-utils): Uses **Podman**
- Development: Can use either **Docker** or **Podman**

No configuration needed - it just works!

## 🌐 URLs

### Production
- **Website**: https://petstar.ro
- **Strapi Dashboard**: https://petstar-dash.ro
- **Strapi API**: https://petstar-dash.ro/api

### Local Development
- **Website**: http://localhost:8081
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api

## 🎯 Common Tasks

### Start Services
```bash
cd docker
make up
```

### Stop Services
```bash
cd docker
make down
```

### View Logs
```bash
cd docker
make logs              # All services
make logs-strapi       # Strapi only
make logs-web          # Web server only
```

### Check Status
```bash
cd docker
make status
```

### Create Backup
```bash
./scripts/backup-strapi.sh
```

### Restore Backup
```bash
./scripts/restore-strapi.sh
```

## 🔧 Development

### Website Structure

The website uses a **template-first approach** with the Solvior theme:

- **No custom CSS/JS** - Use template code as-is
- **Dynamic loading** - Sections are loaded via jQuery
- **Animations** - GSAP and ScrollTrigger for animations

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

### Website Sections

1. Header - Navigation
2. Hero - Main headline with CTA
3. Story - Circular economy narrative
4. Teams - Business units
5. Products - Product categories
6. Accreditations - Certifications
7. Portfolio - Client logos
8. Virtual Tour - Facility galleries
9. Statistics - Impact numbers
10. News - Latest articles
11. Contact CTA - Call-to-action
12. Footer - Company info

## 🆘 Getting Help

### Quick Diagnostics
```bash
cd docker
make status
```

### View Recent Errors
```bash
cd docker
make logs | grep -i error
```

### Emergency Reset
```bash
./scripts/regenerate-strapi-db.sh
```

### Full Documentation
See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for comprehensive troubleshooting.

## 🔐 Security

- Never commit `.env` files
- Use strong Strapi admin passwords
- Regular backups (automated via cron)
- Keep Docker/Podman images updated

## 📦 Services

The project runs three main services:

1. **web** (nginx) - Serves the static website on port 8081
2. **strapi** - Strapi CMS on port 1337
3. **cloudflared** - Cloudflare tunnel for public access

All services are defined in [docker/docker-compose.yml](docker/docker-compose.yml).

## 🤝 Contributing

When developing:
1. Always create **scripts** in the `scripts/` directory
2. Always create **documentation** in the `docs/` directory
3. Follow the guidelines in [CLAUDE.md](CLAUDE.md)
4. Test with both Docker and Podman if possible

## 📄 License

Copyright © 2025 PetStar. All rights reserved.

---

**Need Help?** See [docs/QUICK-REFERENCE.md](docs/QUICK-REFERENCE.md) for a one-page cheat sheet.
