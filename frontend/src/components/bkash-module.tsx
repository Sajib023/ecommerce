"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BkashModuleProps {
  zone: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'
  deliveryFee: number
  bkashNumber?: string
  trxId?: string
  onTrxIdChange?: (trxId: string) => void
}

export function BkashModule({ 
  zone, 
  deliveryFee, 
  bkashNumber = '+88018888888888',
  trxId = '',
  onTrxIdChange 
}: BkashModuleProps) {
  return (
    <Card className="border-neutral-200 bg-neutral-50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">b</span>
            </div>
            <div>
              <h3 className="font-semibold">Advance Delivery Fee Required</h3>
              <p className="text-sm text-neutral-500">Via bKash Payment</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-sm">
            <p className="text-neutral-600">
              To confirm your Cash on Delivery (COD) order, please pay the delivery fee via bKash.
            </p>
            
            <div className="bg-white p-4 rounded-lg space-y-2 border border-neutral-200">
              <div className="flex justify-between">
                <span className="text-neutral-600">Inside Dhaka:</span>
                <span className="font-semibold">৳60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Outside Dhaka:</span>
                <span className="font-semibold">৳120</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Your Zone:</span>
                  <span className="font-semibold">
                    {zone === 'INSIDE_DHAKA' ? 'Inside Dhaka' : 'Outside Dhaka'}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium">Amount to Pay:</span>
                  <span className="font-bold text-lg">৳{deliveryFee}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <p className="text-neutral-500 text-xs mb-2">bKash Personal Number</p>
              <p className="font-mono text-lg font-semibold">{bkashNumber}</p>
              <p className="text-xs text-neutral-500 mt-1">(Send Money)</p>
            </div>

            {/* Transaction ID Input */}
            {onTrxIdChange && (
              <div>
                <Label htmlFor="bkash_trx_id">bKash Transaction ID *</Label>
                <Input
                  id="bkash_trx_id"
                  value={trxId}
                  onChange={(e) => onTrxIdChange(e.target.value.toUpperCase())}
                  placeholder="Enter 10-character TrxID"
                  maxLength={10}
                  className="mt-1.5 font-mono tracking-wider"
                />
              </div>
            )}

            {/* Warning */}
            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">
                After sending, paste your <strong>10-character bKash Transaction ID</strong> below 
                (e.g., BKX71M92B1)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}