"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import { checkout } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BkashModule } from "@/components/bkash-module";
import { formatPrice } from "@/lib/utils";
import { DeliveryZone } from "@/types";
import { ArrowLeft, CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    delivery_address: "",
    zone: "INSIDE_DHAKA" as DeliveryZone,
    bkash_trx_id: "",
  });

  const subtotal = getTotalPrice();
  const deliveryFee = formData.zone === "INSIDE_DHAKA" ? 60 : 120;
  const total = subtotal + deliveryFee;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Your cart is empty</h1>
          <p className="text-neutral-500 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link href="/">
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete && orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Order Confirmed!</h1>
          <p className="text-neutral-500 mb-4">
            Your order has been placed successfully. We&apos;ll start processing it right away.
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-neutral-500">Order ID</p>
            <p className="text-xl font-bold text-neutral-900">{orderId}</p>
          </div>
          <div className="space-y-3">
            <Link href="/track">
              <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                Track Your Order
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        delivery_address: formData.delivery_address,
        zone: formData.zone,
        bkash_trx_id: formData.bkash_trx_id,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          selected_size: item.selectedSize,
        })),
      };

      const result = await checkout(orderData);
      setOrderId(result.id);
      setOrderComplete(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/cart" 
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="delivery_address">Delivery Address *</Label>
                    <Input
                      id="delivery_address"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      placeholder="House/Flat, Road, Area, Thana"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Delivery Zone *</Label>
                    <div className="mt-1.5 grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, zone: "INSIDE_DHAKA" })}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          formData.zone === "INSIDE_DHAKA"
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <span className="block font-medium">Inside Dhaka</span>
                        <span className="text-sm text-neutral-500">৳60 delivery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, zone: "OUTSIDE_DHAKA" })}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          formData.zone === "OUTSIDE_DHAKA"
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <span className="block font-medium">Outside Dhaka</span>
                        <span className="text-sm text-neutral-500">৳120 delivery</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* bKash Payment */}
              <BkashModule 
                zone={formData.zone}
                deliveryFee={formData.zone === "INSIDE_DHAKA" ? 60 : 120}
                trxId={formData.bkash_trx_id}
                onTrxIdChange={(trxId) => setFormData({ ...formData, bkash_trx_id: trxId })}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-6 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>Place Order - {formatPrice(total)}</>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-white rounded border border-neutral-200 overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}