"use client"

import Link from "next/link"
import { ProductListItem } from "@/types"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="aspect-square overflow-hidden bg-neutral-100 rounded-lg relative">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        
        {/* Quick sizes overlay */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1 justify-center flex-wrap">
              {product.sizes.map((size) => (
                <Badge 
                  key={size}
                  variant="secondary"
                  className="bg-white/90 text-neutral-900 text-xs"
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium tracking-wide group-hover:underline underline-offset-4">
          {product.title}
        </h3>
        <p className="text-sm font-semibold text-neutral-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}