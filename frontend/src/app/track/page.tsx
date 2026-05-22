"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderTimeline } from "@/components/order-timeline";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderTracking } from "@/types";
import { Search, Package, Loader2 } from "lucide-react";

export default function TrackPage() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await trackOrder(searchInput.trim());
      setOrder(result);
    } catch (err: any) {
      setError(err.message || "Order not found. Please check your Order ID or phone number.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-neutral-500">
            Enter your Order ID or phone number to check your order status
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g., ORD-xxxxx) or Phone Number"
                className="py-6 text-lg"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !searchInput.trim()}
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Order ID</p>
                  <p className="text-lg font-bold text-neutral-900">{order.id}</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Order Status</h3>
                <OrderTimeline status={order.status} />
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                <div>
                  <p className="text-sm text-neutral-500">Placed On</p>
                  <p className="font-medium text-neutral-900">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Delivery Zone</p>
                  <p className="font-medium text-neutral-900">
                    {order.zone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka"}
                  </p>
                </div>
              </div>

              {/* Help Text */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <strong>Need help?</strong> Contact our customer support at{" "}
                  <a href="tel:+88018888888888" className="text-neutral-900 underline">
                    +880 1888-888888
                  </a>{" "}
                  or email{" "}
                  <a href="mailto:support@luxemen.com" className="text-neutral-900 underline">
                    support@luxemen.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Instructions */}
        {!order && !error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500">
              Your order details will appear here once you search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}