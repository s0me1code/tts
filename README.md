# TTS

Local monorepo for the TTS product.

## Parts

- **`website/`** — Next.js app (Tailwind + shadcn/ui). Run with `pnpm` from that directory.
- **`helper/`** — Python FastAPI local helper (`GET /health` only so far).

## Quick start

```bash
# Helper (terminal 1)
cd helper
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Website (terminal 2)
cd website
pnpm install
pnpm dev
```

Open `http://localhost:3000`. In development, the header shows helper connection status (connected / not connected) via a real `http://127.0.0.1:8000/health` check.
