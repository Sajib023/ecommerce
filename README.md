# Ecommerce Shop

A full-stack e-commerce application built with Next.js and FastAPI.

## Project Structure

```
Ecommerceshop/
├── backend/          # FastAPI backend
│   ├── app/          # Application code
│   ├── uploads/      # Uploaded files
│   └── alembic/      # Database migrations
└── frontend/         # Next.js frontend
    └── src/          # Source code
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment Variables

See `.env.example` in the backend directory for required environment variables.

## Deployment

### Frontend (Vercel)
The frontend is optimized for Vercel deployment. Set `NEXT_PUBLIC_API_URL` to your backend URL.

### Backend (Railway/Render/Fly.io)
1. Set environment variables from `.env.example`
2. Use `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app` for production

## License

MIT