'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { useDarkMode } from '@/context/DarkModeContext'
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import productsData from '@/data/products.json'
import { Product } from '@/types/product'
import { useSearchParams } from 'next/navigation'
 
type FilterType = 'all' | 'on-sale' | 'new-arrivals'

export default function ShopPage() {
  const { isDarkMode } = useDarkMode()
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter') as FilterType | null
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    filterParam && ['all', 'on-sale', 'new-arrivals'].includes(filterParam) 
      ? filterParam 
      : 'all'
  )

  // Add this new useEffect to update activeFilter when URL changes
  useEffect(() => {
    if (filterParam && ['all', 'on-sale', 'new-arrivals'].includes(filterParam)) {
      setActiveFilter(filterParam as FilterType)
    } else {
      setActiveFilter('all')
    }
  }, [filterParam])

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData.products)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
     if (isFilterOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isFilterOpen, isSearchOpen])

  useEffect(() => {
    let filtered: Product[] = productsData.products

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    switch (activeFilter) {
      case 'on-sale':
        filtered = filtered.filter(product => product.discount && product.discount > 0)
        break
      case 'new-arrivals':
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        filtered = filtered.filter(product => {
          if (!product.createdAt) return false
          return new Date(product.createdAt) > thirtyDaysAgo
        })
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, activeFilter])

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <FunnelIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>

      {/* Filter Menu */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 p-6 transition-transform duration-300 z-50 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        } rounded-t-2xl shadow-xl ${
          isFilterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filter Products</h2>
          <button onClick={() => setIsFilterOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {(['all', 'on-sale', 'new-arrivals'] as FilterType[]).map(filter => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter)
                setIsFilterOpen(false)
              }}
              className={`w-full py-3 px-4 rounded-lg transition-colors ${
                activeFilter === filter
                  ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
                  : (isDarkMode ? 'border-gray-700 border' : 'border-gray-200 border')
              }`}
            >
              {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Search Menu */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSearchOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 p-6 transition-transform duration-300 z-50 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        } rounded-t-2xl shadow-xl ${
          isSearchOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Search Products</h2>
          <button onClick={() => setIsSearchOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-white placeholder:text-gray-400' 
                : 'bg-gray-100 text-black placeholder:text-gray-500'
            }`}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}