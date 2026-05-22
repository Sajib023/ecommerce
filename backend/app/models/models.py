from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class DeliveryZone(str, enum.Enum):
    INSIDE_DHAKA = "INSIDE_DHAKA"
    OUTSIDE_DHAKA = "OUTSIDE_DHAKA"


class Category(str, enum.Enum):
    TSHIRT = "TSHIRT"
    POLO = "POLO"
    HOODIE = "HOODIE"
    PANTS = "PANTS"
    SHORTS = "SHORTS"
    JACKET = "JACKET"
    ACCESSORIES = "ACCESSORIES"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    sizes = Column(JSON, nullable=False)  # ['M', 'L', 'XL']
    images = Column(JSON, nullable=False)  # Array of image URLs
    category = Column(Enum(Category), default=Category.TSHIRT)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True)  # e.g., "MNS-2026-XXXX"
    customer_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False)
    delivery_address = Column(Text, nullable=False)
    zone = Column(Enum(DeliveryZone), nullable=False)
    delivery_fee = Column(Numeric(6, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    bkash_trx_id = Column(String(100), unique=True, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING_VERIFICATION)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    selected_size = Column(String(10), nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)