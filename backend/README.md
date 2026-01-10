# RoastMyStartup Backend

FastAPI backend for the RoastMyStartup application.

## Setup

1. Create a virtual environment:
```bash
python -m venv .venv
```

2. Activate the virtual environment:
```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- Main API: http://localhost:8000
- Health check: http://localhost:8000/health
- API Documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # Entry point
│   ├── routes/          # API routes (empty for now)
│   ├── services/        # Business logic (empty for now)
│   ├── schemas/         # Pydantic models (empty for now)
│   └── config/          # Configuration (empty for now)
├── requirements.txt
└── .gitignore
```