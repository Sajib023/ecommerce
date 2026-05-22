"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { fetchAdminOrders, updateOrderStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { Loader2, RefreshCw, Check, X, Eye } from "lucide-react";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  PENDING_VERIFICATION: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

interface AdminOrder {
  id: string;
  customer_name: string;
  phone_number: string;
  delivery_address?: string;
  bkash_trx_id: string;
  total_amount: number;
  zone: string;
  status: OrderStatus;
  created_at: string;
  items: {
    id: number;
    product_id: number;
    quantity: number;
    selected_size: string;
    price_at_purchase: number;
  }[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const data = await fetchAdminOrders(
        token, 
        statusFilter !== "ALL" ? statusFilter : undefined
      );
      setOrders(data.orders || data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
    }
  }, [token, router]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(token, orderId, newStatus);
      await loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
          <p className="text-neutral-500 mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Orders</SelectItem>
              <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={loadOrders}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No orders found</h3>
          <p className="text-neutral-500">There are no orders matching your filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-mono text-sm font-medium text-neutral-900">{order.id}</p>
                        <p className="text-xs text-neutral-500">bKash: {order.bkash_trx_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{order.customer_name}</p>
                        <p className="text-xs text-neutral-500">{order.phone_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        className={ORDER_STATUS_COLORS[order.status]}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {NEXT_STATUS[order.status] && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.status]!)}
                            disabled={isUpdating}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                            disabled={isUpdating}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Customer Name</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Phone Number</p>
                  <p className="font-medium">{selectedOrder.phone_number}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-neutral-500">Delivery Address</p>
                  <p className="font-medium">{selectedOrder.delivery_address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Zone</p>
                  <p className="font-medium">
                    {selectedOrder.zone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">bKash TrxID</p>
                  <p className="font-mono font-medium">{selectedOrder.bkash_trx_id}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm text-neutral-500 mb-2">Items</p>
                <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.id} className="p-4 flex justify-between">
                      <div>
                        <p className="font-medium">Product #{item.product_id}</p>
                        <p className="text-sm text-neutral-500">
                          Size: {item.selected_size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.price_at_purchase * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>{formatPrice(selectedOrder.total_amount)}</span>
              </div>

              {/* Status Update */}
              <div className="border-t border-neutral-200 pt-4">
                <p className="text-sm text-neutral-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["PENDING_VERIFICATION", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      disabled={isUpdating || selectedOrder.status === status}
                      className={
                        selectedOrder.status !== status && status === "CANCELLED"
                          ? "text-red-600 border-red-600 hover:bg-red-50"
                          : ""
                      }
                    >
                      {ORDER_STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}