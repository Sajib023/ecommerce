from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
from decimal import Decimal
from typing import List

from app.core.database import engine, SessionLocal, Base
from app.core.config import settings
from app.api import products_router, orders_router, admin_router
from app.models import Admin, Product, OrderStatus
from app.core.security import get_password_hash

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Men's Premium Fashion E-Commerce API",
    description="Backend API for Men's Premium Fashion E-Commerce Store with bKash COD integration",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(admin_router)


@app.on_event("startup")
def create_default_admin():
    """Create a default admin user if none exists."""
    db = SessionLocal()
    try:
        admin = db.query(Admin).first()
        if not admin:
            default_admin = Admin(
                username="admin",
                hashed_password=get_password_hash("admin123")
            )
            db.add(default_admin)
            db.commit()
            print("✓ Default admin created: admin / admin123")
    finally:
        db.close()


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "Men's Premium Fashion E-Commerce API",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "upload_dir": settings.UPLOAD_DIR
    }


# Admin upload endpoint
from app.api.admin import get_current_admin as get_admin_from_token

@app.post("/api/admin/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_admin: Admin = Depends(get_admin_from_token)
):
    """Upload a product image (Admin only)."""
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and WebP images are allowed")
    
    # Generate unique filename
    import uuid
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": filename, "url": f"/uploads/{filename}"}