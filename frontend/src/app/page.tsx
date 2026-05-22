import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await fetchProducts(1, 20);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4 block">NEW COLLECTION 2024</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Premium Men's Fashion
            </h1>
            <p className="text-lg text-neutral-300 mb-8 max-w-xl">
              Discover timeless elegance with our curated collection of premium menswear. 
              Crafted for the modern gentleman who values quality and sophistication.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-neutral-900 font-semibold hover:bg-neutral-100 transition-colors"
              >
                Shop Collection
              </a>
              <a 
                href="/track"
                className="inline-flex items-center justify-center px-8 py-4 border border-neutral-600 text-white font-semibold hover:bg-neutral-800 transition-colors"
              >
                Track Order
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2 block">CURATED SELECTION</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">Featured Collection</h2>
        </div>

        {(!products.items || products.items.length === 0) ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-neutral-500 text-lg">No products available at the moment</p>
            <p className="text-neutral-400 text-sm mt-2">Check back soon for new arrivals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products.items || []).map((product: any, index: number) => (
              <div 
                key={product.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 mb-2">Free Shipping</h3>
              <p className="text-neutral-500">Complimentary shipping on all orders over ৳3,000</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 mb-2">Secure Payment</h3>
              <p className="text-neutral-500">Pay safely with bKash - Bangladesh's trusted payment partner</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 mb-2">Easy Returns</h3>
              <p className="text-neutral-500">30-day hassle-free return policy on all items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
