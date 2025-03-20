import { Header } from '@/components/Header'
import { HeroBanner } from '@/components/HeroBanner'
import { Categories } from '@/components/sections/Categories'
import { Newsletter } from '@/components/sections/Newsletter'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import productsData from '@/data/products.json'

export default function Home() {
  const newArrivals = productsData.products.filter(p => p.category === 'new-arrivals')
  const featured = productsData.products.filter(p => p.category === 'featured')
  const bestSellers = productsData.products.filter(p => p.category === 'best-sellers')

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Header />
        <HeroBanner />

        <div className="container mx-auto px-6 py-16">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">NEW ARRIVALS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </div>

        <Categories />
        <div className="container mx-auto px-6 py-16">

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">FEATURED COLLECTION</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">BEST SELLERS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </div>

        <Newsletter />
        <Footer />
      </main>
    </div>
  )
}
