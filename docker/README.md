# Docker Setup for PetStar Website

This directory contains all Docker-related files for running the PetStar website and Strapi CMS.

## Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env and add your secrets (see QUICKSTART.md)

# 2. Start services
make up

# 3. Configure Strapi
# Open http://localhost:1337/admin
# Create admin account and API token
```

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide for daily use
- **[README-DOCKER.md](README-DOCKER.md)** - Complete Docker documentation

## Common Commands

```bash
make up          # Start services
make down        # Stop services
make logs        # View logs
make ps          # Check status
make backup      # Backup Strapi data
make restart     # Restart services
```

## File Structure

```
docker/
├── README.md              # This file
├── QUICKSTART.md          # Quick start guide
├── README-DOCKER.md       # Complete documentation
├── docker-compose.yml     # Service definitions
├── nginx.conf             # Web server config
├── .env.example           # Environment template
├── .env                   # Your environment (create this)
├── .dockerignore          # Docker build exclusions
├── Makefile               # Convenience commands
└── backups/               # Backup directory (created on first backup)
```

## Access Points

- **Website**: http://localhost:8081
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api

## Troubleshooting

See [QUICKSTART.md](QUICKSTART.md) for common issues and solutions.
