import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  return `৳${numericPrice.toFixed(0)}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateOrderId(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `MNS-${year}-${random}`
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: 'Verifying Payment',
  PROCESSING: 'Preparing Package',
  SHIPPED: 'Handed to Courier',
  DELIVERED: 'Completed',
  CANCELLED: 'Cancelled'
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: 'text-yellow-600 bg-yellow-50',
  PROCESSING: 'text-blue-600 bg-blue-50',
  SHIPPED: 'text-purple-600 bg-purple-50',
  DELIVERED: 'text-green-600 bg-green-50',
  CANCELLED: 'text-red-600 bg-red-50'
}