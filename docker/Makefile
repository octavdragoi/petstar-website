.PHONY: help up down restart logs logs-web logs-strapi ps build clean backup restore

# Auto-detect container runtime (Docker or Podman)
# Checks in order of preference: docker compose plugin, docker-compose, podman compose plugin, podman-compose
DOCKER_COMPOSE := $(shell command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 && echo "docker compose")
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := $(shell command -v docker-compose >/dev/null 2>&1 && echo "docker-compose")
endif
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := $(shell command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1 && echo "podman compose")
endif
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := $(shell command -v podman-compose >/dev/null 2>&1 && echo "podman-compose")
endif
ifndef DOCKER_COMPOSE
	$(error Neither Docker nor Podman found. Please install Docker or Podman)
endif

DC := $(DOCKER_COMPOSE)

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Using container runtime: $(DC)'
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

backup: ## Backup Strapi data (use ../scripts/backup-strapi.sh for comprehensive backup)
	@echo "Note: For comprehensive backups, use: cd .. && ./scripts/backup-strapi.sh"
	@mkdir -p ../backups
	@cd .. && ./scripts/backup-strapi.sh

restore: ## Restore Strapi data (use ../scripts/restore-strapi.sh for interactive restore)
	@echo "Note: For interactive restore, use: cd .. && ./scripts/restore-strapi.sh"
	@cd .. && ./scripts/restore-strapi.sh

status: ## Check health status of services
	@echo "=== Container Status ==="
	@$(DC) ps
	@echo ""
	@echo "=== Strapi Health ==="
	@curl -s http://localhost:1337/_health || echo "Strapi not responding"
	@echo ""
	@echo "=== Web Server Status ==="
	@curl -s -I http://localhost:8081 | head -1 || echo "Web server not responding"
