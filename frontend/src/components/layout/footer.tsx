import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold tracking-widest uppercase">
              Maison<span className="text-neutral-400">|</span>Noir
            </span>
            <p className="mt-4 text-sm text-neutral-500">
              Premium men's fashion for the modern gentleman. 
              Elevate your style with our curated collection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-neutral-600 hover:text-neutral-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Phone: +88018888888888</li>
              <li>Email: support@maisonnior.com</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} Maison|Noir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}