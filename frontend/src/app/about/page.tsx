export const metadata = {
  title: 'About Us - Maison|Noir',
  description: 'Learn about Maison|Noir - Premium streetwear from Bangladesh',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-neutral-400 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white">About Us</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About Maison|Noir</h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Story Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-neutral">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Maison|Noir was born from a vision to create premium streetwear that bridges the gap between 
              contemporary fashion and everyday comfort. Founded in Dhaka, Bangladesh, we believe that style 
              shouldn't come at the expense of quality or ethics.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Every piece in our collection is thoughtfully designed and crafted with attention to detail. 
              From the selection of fabrics to the final stitches, we ensure that our products meet the highest 
              standards of craftsmanship.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-neutral-50 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Quality</h3>
            <p className="text-neutral-600">
              We use premium materials and rigorous quality control to ensure every product exceeds expectations.
            </p>
          </div>
          
          <div className="text-center p-8 bg-neutral-50 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Sustainability</h3>
            <p className="text-neutral-600">
              We're committed to reducing our environmental footprint through responsible sourcing and production.
            </p>
          </div>
          
          <div className="text-center p-8 bg-neutral-50 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-neutral-600">
              We believe in giving back to our community and supporting local artisans and manufacturers.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-neutral-900 text-white p-12 rounded-lg text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            "To create timeless, high-quality streetwear that empowers individuals to express their unique style 
            while making a positive impact on our community and environment."
          </p>
        </div>

        {/* Team Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Journey</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-neutral-400">2023</span>
              </div>
              <div>
                <h3 className="font-bold">The Beginning</h3>
                <p className="text-neutral-600">Maison|Noir was established with a small collection of premium t-shirts.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-neutral-400">2024</span>
              </div>
              <div>
                <h3 className="font-bold">Growing Together</h3>
                <p className="text-neutral-600">Expanded our collection to include hoodies, pants, and accessories.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-neutral-400">Today</span>
              </div>
              <div>
                <h3 className="font-bold">Continuing the Vision</h3>
                <p className="text-neutral-600">Serving customers across Bangladesh with a commitment to quality and style.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}