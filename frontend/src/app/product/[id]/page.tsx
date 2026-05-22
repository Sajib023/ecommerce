"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProduct } from "@/lib/api";
import { useCartStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Product, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_VERIFICATION: "Pending Verification",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const id = params.id as string;
        const data = await fetchProduct(parseInt(id));
        setProduct(data);
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err: any) {
        setError("Product not found");
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
        sizes: product.sizes,
        is_active: product.is_active,
      },
      selectedSize
    );
    
    // Add quantity more
    for (let i = 1; i < quantity; i++) {
      addItem(
        {
          id: product.id,
          title: product.title,
          price: product.price,
          images: product.images,
          sizes: product.sizes,
          is_active: product.is_active,
        },
        selectedSize
      );
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h1>
          <p className="text-neutral-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/">
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      selectedImage === index
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-neutral-900">{formatPrice(product.price)}</p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-neutral-600 leading-relaxed">{product.description}</p>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-neutral-900">Select Size</label>
                <span className="text-sm text-neutral-500">Selected: {selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-neutral-900 text-white"
                        : "bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="font-semibold text-neutral-900 block mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock_quantity > 0 && (
                  <span className="text-sm text-neutral-500">
                    {product.stock_quantity} in stock
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || product.stock_quantity === 0}
                className={`w-full py-6 text-lg ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-neutral-900 hover:bg-neutral-800"
                } text-white`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart - {formatPrice(product.price * quantity)}
                  </>
                )}
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-neutral-600">Free shipping on orders over ৳3,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-neutral-600">30-day easy returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-neutral-600">Secure bKash payment for delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}