from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from decimal import Decimal

from app.core.database import get_db
from app.core.config import settings
from app.models import Order, OrderItem, Product, OrderStatus, DeliveryZone
from app.schemas import (
    OrderCreate, OrderResponse, OrderListResponse, OrderTrackingResponse, DeliveryZoneEnum, OrderStatusEnum
)

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def generate_order_id() -> str:
    """Generate a unique order ID like 'MNS-2026-XXXX'"""
    year = datetime.now().year
    # Get count of orders this year and add 1
    prefix = f"MNS-{year}-"
    return f"{prefix}{datetime.now().strftime('%m%d%H%M')}"


def calculate_delivery_fee(zone: DeliveryZoneEnum) -> Decimal:
    """Calculate delivery fee based on zone."""
    if zone == DeliveryZoneEnum.INSIDE_DHAKA:
        return Decimal(str(settings.DELIVERY_FEE_INSIDE_DHAKA))
    return Decimal(str(settings.DELIVERY_FEE_OUTSIDE_DHAKA))


@router.post("/checkout", response_model=OrderResponse, status_code=201)
def checkout(order_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Submit customer order with bKash transaction ID.
    Validates uniqueness of bKash TrxID and creates order.
    """
    # Calculate delivery fee
    delivery_fee = calculate_delivery_fee(order_data.zone)
    
    # Calculate total from cart items
    total_amount = Decimal("0")
    order_items_data = []
    
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=400,
                detail=f"Product with ID {item.product_id} not found"
            )
        if item.selected_size not in product.sizes:
            raise HTTPException(
                status_code=400,
                detail=f"Size '{item.selected_size}' not available for product '{product.title}'"
            )
        if item.quantity > product.stock_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.title}'. Available: {product.stock_quantity}"
            )
        
        item_total = product.price * item.quantity
        total_amount += item_total
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "selected_size": item.selected_size,
            "price": product.price
        })
    
    # Add delivery fee to total
    total_amount += delivery_fee
    
    # Generate order ID
    order_id = generate_order_id()
    
    # Create order
    order = Order(
        id=order_id,
        customer_name=order_data.customer_name,
        phone_number=order_data.phone_number,
        delivery_address=order_data.delivery_address,
        zone=order_data.zone,
        delivery_fee=delivery_fee,
        total_amount=total_amount,
        bkash_trx_id=order_data.bkash_trx_id,
        status=OrderStatus.PENDING_VERIFICATION
    )
    
    db.add(order)
    
    # Create order items and update stock
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order_id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            selected_size=item_data["selected_size"],
            price_at_purchase=item_data["price"]
        )
        db.add(order_item)
        
        # Decrease stock
        item_data["product"].stock_quantity -= item_data["quantity"]
    
    try:
        db.commit()
        db.refresh(order)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="This transaction ID has already been used. Please check and try again."
        )
    
    return order


@router.get("/track/{identifier}", response_model=OrderTrackingResponse)
def track_order(identifier: str, db: Session = Depends(get_db)):
    """
    Track order by order ID or phone number.
    Returns limited order metadata for security.
    """
    # Try to find by order ID first
    order = db.query(Order).filter(Order.id == identifier).first()
    
    # If not found, try by phone number (return most recent order)
    if not order:
        order = db.query(Order)\
                  .filter(Order.phone_number == identifier)\
                  .order_by(Order.created_at.desc())\
                  .first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    """Get detailed order information."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order