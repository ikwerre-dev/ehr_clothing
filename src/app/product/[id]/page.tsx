'use client'

import { useState } from 'react'
import { use } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { useDarkMode } from '@/context/DarkModeContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import productsData from '@/data/products.json'
import { useCart } from '@/context/CartContext'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red']

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { isDarkMode } = useDarkMode()
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  
  const { id } = use(params)
  const product = productsData.products.find(p => p.id === id)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color')
      return
    }

    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        image: product.image
      })
      alert('Added to cart successfully!')
    }
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">({product.reviewCount} reviews)</span>
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-bold">₦{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                  <p className="text-gray-600 dark:text-gray-400 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </p>
                )}
                {product.discount && (
                  <p className="text-red-600">-{product.discount}% OFF</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Select Size</h3>
                  <div className="flex gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded ${
                          selectedSize === size 
                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Select Color</h3>
                  <div className="flex gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded ${
                          selectedColor === color 
                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Add to Cart
              </button>

              <div className="prose dark:prose-invert">
                <h3>Product Description</h3>
                <p>{product.description || "Experience premium quality and style with this carefully crafted piece from our collection."}</p>
                
                <h3>Features</h3>
                <ul>
                  <li>Premium quality material</li>
                  <li>Comfortable fit</li>
                  <li>Easy to maintain</li>
                  <li>Durable construction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}