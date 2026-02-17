# Makefile for moment-umm project

.PHONY: setup start stop logs clean

setup:
	@echo "Setting up project..."
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env file - update with your keys!"; fi
	@docker compose build

start:
	@echo "Starting services..."
	@docker compose up -d
	@echo "Backend running on http://localhost:8000"
	@echo "Frontend running on http://localhost:5173"

stop:
	@echo "Stopping services..."
	@docker compose down

logs:
	@docker compose logs -f

clean:
	@echo "Cleaning up..."
	@docker compose down -v
	@rm -rf .venv frontend/node_modules
