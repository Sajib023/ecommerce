const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface CheckoutData {
  customer_name: string
  phone_number: string
  delivery_address: string
  zone: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'
  items: {
    product_id: number
    quantity: number
    selected_size: string
  }[]
  bkash_trx_id: string
}

export interface OrderResponse {
  id: string
  status: string
  total_amount: number
}

export async function fetchProducts(
  page = 1, 
  pageSize = 12, 
  category?: string,
  search?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  })
  if (category) params.append('category', category)
  if (search) params.append('search', search)

  const res = await fetch(`${API_BASE_URL}/api/products?${params}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchProduct(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function checkout(data: CheckoutData): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || 'Checkout failed')
  }
  return res.json()
}

export async function trackOrder(identifier: string) {
  const res = await fetch(`${API_BASE_URL}/api/orders/track/${identifier}`)
  if (!res.ok) throw new Error('Order not found')
  return res.json()
}

// Admin API
export interface LoginResponse {
  access_token: string
  token_type: string
}

export async function adminLogin(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}

export async function fetchAdminOrders(token: string, statusFilter?: string) {
  const params = statusFilter ? `?status_filter=${statusFilter}` : ''
  const res = await fetch(`${API_BASE_URL}/api/admin/orders${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export async function updateOrderStatus(token: string, orderId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status?new_status=${status}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}

export async function fetchAdminOrderDetails(token: string, orderId: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch order details')
  return res.json()
}

export async function uploadImage(token: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) throw new Error('Failed to upload image')
  return res.json()
}

export async function createProduct(token: string, data: {
  title: string
  description?: string
  price: number
  stock_quantity: number
  sizes: string[]
  images: string[]
}) {
  const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(token: string, productId: number, data: Partial<{
  title: string
  description: string
  price: number
  stock_quantity: number
  sizes: string[]
  is_active: boolean
  images: string[]
}>) {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function fetchAdminProducts(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function deleteProduct(token: string, productId: number) {
  const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return true
}