import { Header } from '@/components/Header'
import { HeroBanner } from '@/components/HeroBanner'
import { Categories } from '@/components/sections/Categories'
import { Newsletter } from '@/components/sections/Newsletter'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'
import { Product } from '@/types/product' // Add this import
import { useDarkMode } from '@/context/DarkModeContext'
import { ThemeContainer } from '@/components/ThemeContainer'

async function getProducts() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [newArrivals, bestSellers, regularProducts] = await Promise.all([
    // New arrivals (unchanged)
    prisma.product.findMany({
      where: { 
        createdAt: { gte: thirtyDaysAgo }
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    // Best sellers based on order count
    prisma.product.findMany({
      include: {
        category: true,
        orderItems: true,
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 8,
    }),
    // Regular products for featured selection
    prisma.product.findMany({
      include: { category: true },
    })
  ])

  // Randomly select 8 products for featured
  const featured = regularProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)

  return { newArrivals, bestSellers, featured }
}

export default async function Home() {
  const { newArrivals, bestSellers, featured } = await getProducts()

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
                {newArrivals.map((product: Product) => (
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
                {featured.map((product: Product) => (
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
                {bestSellers.map((product: Product) => (
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
