"use client"

import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils"
import { OrderStatus } from "@/types"
import { Check } from "lucide-react"

interface OrderTimelineProps {
  status: OrderStatus
}

const statusSteps: OrderStatus[] = [
  'PENDING_VERIFICATION',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED'
]

export function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = statusSteps.indexOf(status)
  const isCancelled = status === 'CANCELLED'

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <Badge variant="destructive" className="text-sm px-4 py-1">
          Order Cancelled
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {statusSteps.map((step, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step} className="flex items-center gap-3">
            {/* Status indicator */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>

            {/* Status text */}
            <div className="flex-1">
              <p 
                className={`text-sm font-medium ${
                  isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                }`}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
              {isCurrent && (
                <p className="text-xs text-neutral-500">Current Status</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}