import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES } from "@/types";

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const slugLower = slug.toLowerCase();
  
  // Validate category
  const category = CATEGORIES.find(c => c.value.toLowerCase() === slugLower);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Category Not Found</h1>
          <p className="text-neutral-500 mb-6">The category you're looking for doesn't exist.</p>
          <a href="/" className="text-sm font-medium text-neutral-900 hover:text-neutral-600 underline">
            Return to Collection
          </a>
        </div>
      </div>
    );
  }

  const products = await fetchProducts(1, 50, category.value);

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-neutral-400 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white">{category.label}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {category.label}
          </h1>
          <p className="text-neutral-400 mt-2">
            {products.items.length} {products.items.length === 1 ? "product" : "products"} available
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-neutral-500 text-lg">No products in this category yet</p>
            <p className="text-neutral-400 text-sm mt-2">Check back soon for new arrivals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.items.map((product: any, index: number) => (
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
    </div>
  );
}