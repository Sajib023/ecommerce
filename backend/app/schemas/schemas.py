from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Union
from datetime import datetime
from decimal import Decimal
from enum import Enum
import json


class DeliveryZoneEnum(str, Enum):
    INSIDE_DHAKA = "INSIDE_DHAKA"
    OUTSIDE_DHAKA = "OUTSIDE_DHAKA"


class CategoryEnum(str, Enum):
    TSHIRT = "TSHIRT"
    POLO = "POLO"
    HOODIE = "HOODIE"
    PANTS = "PANTS"
    SHORTS = "SHORTS"
    JACKET = "JACKET"
    ACCESSORIES = "ACCESSORIES"


class OrderStatusEnum(str, Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


def parse_json_list(value):
    """Parse a JSON list from string or list."""
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
    raise ValueError(f"Expected a list, got {type(value)}")


# Product Schemas
class ProductBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    sizes: List[str] = Field(..., min_length=1)
    category: CategoryEnum = CategoryEnum.TSHIRT
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    sizes: Optional[List[str]] = None
    category: Optional[CategoryEnum] = None
    is_active: Optional[bool] = None
    images: Optional[List[str]] = None


class ProductResponse(ProductBase):
    id: int
    images: List[str]
    created_at: datetime
    updated_at: datetime

    @field_validator('images', mode='before')
    @classmethod
    def parse_images(cls, v):
        return parse_json_list(v)

    @field_validator('sizes', mode='before')
    @classmethod
    def parse_sizes(cls, v):
        return parse_json_list(v)

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    id: int
    title: str
    price: Decimal
    images: List[str]
    sizes: List[str]
    category: CategoryEnum
    is_active: bool

    @field_validator('images', mode='before')
    @classmethod
    def parse_images(cls, v):
        return parse_json_list(v)

    @field_validator('sizes', mode='before')
    @classmethod
    def parse_sizes(cls, v):
        return parse_json_list(v)

    class Config:
        from_attributes = True


# Order Item Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    selected_size: str


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    selected_size: str
    price_at_purchase: Decimal

    class Config:
        from_attributes = True


# Order Schemas
class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    phone_number: str = Field(..., min_length=1, max_length=20)
    delivery_address: str = Field(..., min_length=1)
    zone: DeliveryZoneEnum
    items: List[OrderItemCreate] = Field(..., min_length=1)
    bkash_trx_id: str = Field(..., min_length=1, max_length=100)


class OrderStatusUpdate(BaseModel):
    status: OrderStatusEnum


class OrderResponse(BaseModel):
    id: str
    customer_name: str
    phone_number: str
    delivery_address: str
    zone: DeliveryZoneEnum
    delivery_fee: Decimal
    total_amount: Decimal
    bkash_trx_id: str
    status: OrderStatusEnum
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    id: str
    customer_name: str
    phone_number: str
    total_amount: Decimal
    bkash_trx_id: str
    status: OrderStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True


class OrderTrackingResponse(BaseModel):
    id: str
    status: OrderStatusEnum
    created_at: datetime
    zone: DeliveryZoneEnum

    class Config:
        from_attributes = True


# Admin Schemas
class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


# Pagination
class PaginatedProductResponse(BaseModel):
    items: List[ProductListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Error Response
class ErrorResponse(BaseModel):
    detail: str