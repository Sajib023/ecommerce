from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from decimal import Decimal

from app.core.database import get_db
from app.models import Product
from app.schemas import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse, PaginatedProductResponse
)

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=PaginatedProductResponse)
def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    size_filter: Optional[str] = Query(None, description="Filter by available size (e.g., 'M', 'L', 'XL')"),
    category: Optional[str] = Query(None, description="Filter by category (e.g., 'TSHIRT', 'POLO')"),
    search: Optional[str] = Query(None, description="Search products by title or description (semantic search)"),
    db: Session = Depends(get_db)
):
    """Get all active products with pagination, filters, and semantic search."""
    query = db.query(Product).filter(Product.is_active == True)
    
    if size_filter:
        query = query.filter(Product.sizes.contains([size_filter]))
    
    if category:
        query = query.filter(Product.category == category)
    
    # Semantic search - searches title and description
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.title.ilike(search_term)) | 
            (Product.description.ilike(search_term))
        )
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    products = query.order_by(Product.created_at.desc())\
                    .offset((page - 1) * page_size)\
                    .limit(page_size)\
                    .all()
    
    return PaginatedProductResponse(
        items=[ProductListResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    title: str,
    description: Optional[str] = None,
    price: Decimal = Query(..., gt=0),
    stock_quantity: int = Query(0, ge=0),
    sizes: List[str] = Query(...),
    images: List[str] = Query(...),
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Create a new product (Admin only - requires authentication in main.py)."""
    product = Product(
        title=title,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        sizes=sizes,
        images=images,
        is_active=is_active
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    price: Optional[Decimal] = None,
    stock_quantity: Optional[int] = None,
    sizes: Optional[List[str]] = None,
    is_active: Optional[bool] = None,
    images: Optional[List[str]] = None,
    db: Session = Depends(get_db)
):
    """Update a product (Admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if title is not None:
        product.title = title
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if stock_quantity is not None:
        product.stock_quantity = stock_quantity
    if sizes is not None:
        product.sizes = sizes
    if is_active is not None:
        product.is_active = is_active
    if images is not None:
        product.images = product.images + images if product.images else images
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product (Admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None