.PHONY: help up down restart logs logs-web logs-strapi ps build clean backup restore

# Docker Compose command (we're in docker/ subdirectory)
# DC := docker-compose
DC := podman-compose

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start all services
	$(DC) up -d
	@echo "Services started!"
	@echo "Website: http://localhost:8081"
	@echo "Strapi Admin: http://localhost:1337/admin"

down: ## Stop all services
	$(DC) down

restart: ## Restart all services
	$(DC) restart

logs: ## View logs from all services
	$(DC) logs -f

logs-web: ## View web server logs
	$(DC) logs -f web

logs-strapi: ## View Strapi logs
	$(DC) logs -f strapi

ps: ## Show running containers
	$(DC) ps

build: ## Rebuild services
	$(DC) build

clean: ## Stop services and remove volumes (WARNING: deletes data!)
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DC) down -v; \
		echo "Services stopped and volumes removed"; \
	fi

backup: ## Backup Strapi data
	@mkdir -p backups
	docker run --rm -v petstar-website_strapi-data:/data -v $$(pwd)/backups:/backup alpine tar czf /backup/strapi-backup-$$(date +%Y%m%d-%H%M%S).tar.gz /data
	@echo "Backup created in docker/backups/ directory"

restore: ## Restore Strapi data (usage: make restore FILE=backups/strapi-backup-20251103-123456.tar.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify backup file. Usage: make restore FILE=backups/strapi-backup-20251103-123456.tar.gz"; \
		exit 1; \
	fi
	$(DC) down
	docker run --rm -v petstar-website_strapi-data:/data -v $$(pwd):/backup alpine tar xzf /backup/$(FILE) -C /
	$(DC) up -d
	@echo "Restored from $(FILE)"

status: ## Check health status of services
	@echo "=== Container Status ==="
	@$(DC) ps
	@echo ""
	@echo "=== Strapi Health ==="
	@curl -s http://localhost:1337/_health || echo "Strapi not responding"
	@echo ""
	@echo "=== Web Server Status ==="
	@curl -s -I http://localhost:8081 | head -1 || echo "Web server not responding"
