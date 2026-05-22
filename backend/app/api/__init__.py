from app.api.products import router as products_router
from app.api.orders import router as orders_router
from app.api.admin import router as admin_router

__all__ = ["products_router", "orders_router", "admin_router"]