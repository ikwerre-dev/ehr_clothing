'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { useDarkMode } from '@/context/DarkModeContext'
import productsData from '@/data/products.json'
import { FunnelIcon } from '@heroicons/react/24/outline'

type FilterType = 'all' | 'on-sale' | 'new-arrivals'

export default function ShopPage() {
  const { isDarkMode } = useDarkMode()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [filteredProducts, setFilteredProducts] = useState(productsData.products)

  useEffect(() => {
    let filtered = productsData.products

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    switch (activeFilter) {
      case 'on-sale':
        filtered = filtered.filter(product => product.discount)
        break
      case 'new-arrivals':
        filtered = filtered.filter(product => product.isNew)
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, activeFilter])

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header onSearch={setSearchQuery} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'all' 
                  ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
                  : 'border'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveFilter('on-sale')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'on-sale' 
                  ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
                  : 'border'
              }`}
            >
              On Sale
            </button>
            <button
              onClick={() => setActiveFilter('new-arrivals')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'new-arrivals' 
                  ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
                  : 'border'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}