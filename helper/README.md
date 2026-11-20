# Helper

Minimal Python FastAPI local helper for TTS.

Dev surface so far: `GET /health` → `{"status":"ok"}` (CORS open to the local Next site).

## Run

```bash
cd helper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Health check: `http://127.0.0.1:8000/health`

## Layout

- `app/` — FastAPI application package
- `requirements.txt` — FastAPI + uvicorn
