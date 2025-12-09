DC_DEV = docker compose -f compose.dev.yml
DC_PROD = docker compose -f compose.prod.yml

.PHONY: up down restart logs sh build help

up:
	$(DC_DEV) up -d

down:
	$(DC_DEV) down

build:
	$(DC_DEV) build

restart: down up

logs:
	$(DC_DEV) logs -f

shell:
	$(DC_DEV) exec app /bin/bash

help:
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  up        Start dev environment"
	@echo "  down      Stop dev environment"
	@echo "  build     Rebuild dev images"
	@echo "  logs      Follow logs"
	@echo "  shell     Enter backend container shell"