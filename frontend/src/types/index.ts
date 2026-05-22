export interface Product {
  id: number
  title: string
  description: string | null
  price: number
  stock_quantity: number
  sizes: string[]
  images: string[]
  category: Category
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductListItem {
  id: number
  title: string
  price: number
  images: string[]
  sizes: string[]
  category: Category
  is_active: boolean
}

export interface CartItem {
  product: ProductListItem
  quantity: number
  selectedSize: string
}

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  selected_size: string
  price_at_purchase: number
}

export type Category = 'TSHIRT' | 'POLO' | 'HOODIE' | 'PANTS' | 'SHORTS' | 'JACKET' | 'ACCESSORIES'

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'TSHIRT', label: 'T-Shirts' },
  { value: 'POLO', label: 'Polo Shirts' },
  { value: 'HOODIE', label: 'Hoodies' },
  { value: 'PANTS', label: 'Pants' },
  { value: 'SHORTS', label: 'Shorts' },
  { value: 'JACKET', label: 'Jackets' },
  { value: 'ACCESSORIES', label: 'Accessories' },
]

export type DeliveryZone = 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'
export type OrderStatus = 'PENDING_VERIFICATION' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  id: string
  customer_name: string
  phone_number: string
  delivery_address: string
  zone: DeliveryZone
  delivery_fee: number
  total_amount: number
  bkash_trx_id: string
  status: OrderStatus
  created_at: string
  items: OrderItem[]
}

export interface OrderCreate {
  customer_name: string
  phone_number: string
  delivery_address: string
  zone: DeliveryZone
  items: {
    product_id: number
    quantity: number
    selected_size: string
  }[]
  bkash_trx_id: string
}

export interface OrderTracking {
  id: string
  status: OrderStatus
  created_at: string
  zone: DeliveryZone
}

export interface AdminUser {
  id: number
  username: string
}

export interface PaginatedProducts {
  items: ProductListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiError {
  detail: string
}