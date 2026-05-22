"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Menu, X, ChevronDown, Search } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCartStore } from "@/store"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/types"
import { Input } from "@/components/ui/input"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCartStore()
  const categoryRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Prevent hydration mismatch with localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus search input when search is opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Close category menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }
  
  const totalItems = mounted ? getTotalItems() : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-widest uppercase">
              Maison<span className="text-neutral-400">|</span>Noir
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium tracking-wide uppercase hover:text-neutral-600 transition-colors"
            >
              Collection
            </Link>
            
            {/* Categories Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex items-center text-sm font-medium tracking-wide uppercase hover:text-neutral-600 transition-colors"
              >
                Categories
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {categoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/category/${cat.value.toLowerCase()}`}
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                      onClick={() => setCategoryMenuOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/track" 
              className="text-sm font-medium tracking-wide uppercase hover:text-neutral-600 transition-colors"
            >
              Track Order
            </Link>

            <Link 
              href="/size-guide" 
              className="text-sm font-medium tracking-wide uppercase hover:text-neutral-600 transition-colors"
            >
              Size Guide
            </Link>

            <Link 
              href="/about" 
              className="text-sm font-medium tracking-wide uppercase hover:text-neutral-600 transition-colors"
            >
              About
            </Link>

            <Link 
              href="/contact" 
              className="text-sm font-medium tracking-wide uppercase hover:text-neutral-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Cart, Search & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-neutral-200">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-sm font-medium tracking-wide uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collection
              </Link>
              
              {/* Mobile Categories */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Categories</span>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/category/${cat.value.toLowerCase()}`}
                    className="block pl-4 text-sm font-medium tracking-wide uppercase hover:text-neutral-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
              
              <Link 
                href="/track" 
                className="text-sm font-medium tracking-wide uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Order
              </Link>

              <Link 
                href="/size-guide" 
                className="text-sm font-medium tracking-wide uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Size Guide
              </Link>

              <Link 
                href="/about" 
                className="text-sm font-medium tracking-wide uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <Link 
                href="/contact" 
                className="text-sm font-medium tracking-wide uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}