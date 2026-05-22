export const metadata = {
  title: 'Size Guide - Maison|Noir',
  description: 'Find your perfect fit with our detailed size guide',
}

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-neutral-400 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white">Size Guide</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Size Guide</h1>
          <p className="text-neutral-400 mt-2">Find your perfect fit with our detailed measurements</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-neutral max-w-none">
          
          {/* How to Measure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Measure</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Chest/Bust</h3>
                <p className="text-neutral-600">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Waist</h3>
                <p className="text-neutral-600">Measure around your natural waistline, keeping the tape comfortable but snug.</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Hips</h3>
                <p className="text-neutral-600">Measure around the fullest part of your hips, about 8" below your waist.</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Inseam</h3>
                <p className="text-neutral-600">Measure from the crotch seam to the bottom of the leg along the inside seam.</p>
              </div>
            </div>
          </div>

          {/* T-Shirts & Polos */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">T-Shirts & Polos</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium">Size</th>
                    <th className="text-left py-3 px-4 font-medium">Chest (in)</th>
                    <th className="text-left py-3 px-4 font-medium">Chest (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600">
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">S</td>
                    <td className="py-3 px-4">36-38</td>
                    <td className="py-3 px-4">91-97</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">M</td>
                    <td className="py-3 px-4">38-40</td>
                    <td className="py-3 px-4">97-102</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">L</td>
                    <td className="py-3 px-4">40-42</td>
                    <td className="py-3 px-4">102-107</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">XL</td>
                    <td className="py-3 px-4">42-44</td>
                    <td className="py-3 px-4">107-112</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">XXL</td>
                    <td className="py-3 px-4">44-46</td>
                    <td className="py-3 px-4">112-117</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hoodies & Jackets */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Hoodies & Jackets</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium">Size</th>
                    <th className="text-left py-3 px-4 font-medium">Chest (in)</th>
                    <th className="text-left py-3 px-4 font-medium">Chest (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600">
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">S</td>
                    <td className="py-3 px-4">38-40</td>
                    <td className="py-3 px-4">97-102</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">M</td>
                    <td className="py-3 px-4">40-42</td>
                    <td className="py-3 px-4">102-107</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">L</td>
                    <td className="py-3 px-4">42-44</td>
                    <td className="py-3 px-4">107-112</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">XL</td>
                    <td className="py-3 px-4">44-46</td>
                    <td className="py-3 px-4">112-117</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">XXL</td>
                    <td className="py-3 px-4">46-48</td>
                    <td className="py-3 px-4">117-122</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pants & Shorts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Pants & Shorts</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium">Size</th>
                    <th className="text-left py-3 px-4 font-medium">Waist (in)</th>
                    <th className="text-left py-3 px-4 font-medium">Waist (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600">
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">S</td>
                    <td className="py-3 px-4">28-30</td>
                    <td className="py-3 px-4">71-76</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">M</td>
                    <td className="py-3 px-4">30-32</td>
                    <td className="py-3 px-4">76-81</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">L</td>
                    <td className="py-3 px-4">32-34</td>
                    <td className="py-3 px-4">81-86</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium">XL</td>
                    <td className="py-3 px-4">34-36</td>
                    <td className="py-3 px-4">86-91</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">XXL</td>
                    <td className="py-3 px-4">36-38</td>
                    <td className="py-3 px-4">91-97</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Guide */}
          <div className="bg-neutral-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Fit Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Slim Fit</h3>
                <p className="text-neutral-600 text-sm">Tighter through the body with a tapered silhouette. For a modern, streamlined look.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Regular Fit</h3>
                <p className="text-neutral-600 text-sm">Comfortable throughout with room for movement. Our most popular fit.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Relaxed Fit</h3>
                <p className="text-neutral-600 text-sm">Looser through the body for maximum comfort. Ideal for layering.</p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 border border-neutral-200 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-neutral-600">
              If you're between sizes or unsure which size to choose, we recommend sizing up for a more comfortable fit.
              Still have questions? <a href="/contact" className="text-neutral-900 underline font-medium">Contact us</a> and we'll be happy to help.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}