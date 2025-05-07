"use client"

import { Suspense, useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { HeroBanner } from '@/components/HeroBanner'
import { Categories } from '@/components/sections/Categories'
import { Newsletter } from '@/components/sections/Newsletter'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types/product'
import { ThemeContainer } from '@/components/ThemeContainer'

type ProductData = {
  newArrivals: Product[]
  bestSellers: Product[]
  featured: Product[]
}

export default function Home() {
  const [products, setProducts] = useState<ProductData>({
    newArrivals: [],
    bestSellers: [],
    featured: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/landing')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Header />
        <HeroBanner />

        <ThemeContainer>
          <div className="container mx-auto px-6 py-16">
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">NEW ARRIVALS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.newArrivals?.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    image={product.images[0]}
                    rating={4.5}
                    reviewCount={0}
                  />
                ))}
              </div>
            </section>
          </div>

          <Categories />
          <div className="container mx-auto px-6 py-16">
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">FEATURED COLLECTION</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.featured?.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    image={product.images[0]}
                    rating={4.5}
                    reviewCount={0}
                  />
                ))}
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">BEST SELLERS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.bestSellers?.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    image={product.images[0]}
                    rating={4.5}
                    reviewCount={0}
                  />
                ))}
              </div>
            </section>
          </div>
        </ThemeContainer>

        <Newsletter />
        <Footer />
      </main>
    </div>
  )
}
