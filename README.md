# moment-umm
when your brain goes 'Umm...'

## Quick Start (Docker)

1.  **Prerequisites:** Install Docker & Docker Compose.
2.  **Setup:** `make setup` (First time only)
3.  **Start:** `make start`
    - Backend: http://localhost:8000
    - Frontend: http://localhost:5173
4.  **Stop:** `make stop`

## Manual Setup

1.  **Backend:**
    - Install `uv`: `curl -LsSf https://astral.sh/uv/install.sh | sh`
    - Install dependencies: `uv sync`
    - Run: `uv run uvicorn app.main:app --reload`

2.  **Frontend:**
    - Install: `cd frontend && npm install`
    - Run: `cd frontend && npm run dev`
