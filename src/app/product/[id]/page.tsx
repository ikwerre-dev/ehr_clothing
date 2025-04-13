'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/context/DarkModeContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  stock: number
  category: {
    name: string
  }
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const INITIAL_COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red']
const ALL_COLORS = [
  'Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 
  'Pink', 'Purple', 'Orange', 'Brown', 'Beige', 'Teal', 'Maroon', 
  'Olive', 'Turquoise', 'Coral', 'Indigo', 'Lavender'
]

export default function ProductPage() {
  const { isDarkMode } = useDarkMode()
  const { addItem } = useCart()
  const params = useParams()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showColorPopup, setShowColorPopup] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  useEffect(() => {
    if (showColorPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showColorPopup])

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color')
      return
    }

    if (product) {
      addItem({
        id: product.id,
        title: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        image: product.images[0]
      })
      alert('Added to cart successfully!')
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold">₦{product.price.toLocaleString()}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded ${
                          selectedSize === size 
                            ? (isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                            : (isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-500')
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Select Color</h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    {INITIAL_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded ${
                          selectedColor === color 
                            ? (isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                            : (isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-500')
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowColorPopup(true)}
                      className={`px-4 py-2 border rounded ${
                        isDarkMode ? 'border-gray-600 hover:border-gray-400 text-gray-300' : 'border-gray-300 hover:border-gray-500 text-gray-600'
                      }`}
                    >
                      Select More
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-lg transition-colors ${
                  product.stock === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isDarkMode 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                <h3 className="text-lg mt-5 font-bold">Product Description</h3>
                <p>{product.description}</p>
                
                <h3 className="text-lg mt-5 font-bold">Category</h3>
                <p>{product.category.name}</p>

                <h3 className="text-lg mt-5 font-bold">Features</h3>
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

      {/* Color Popup Modal */}
      {showColorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select a Color</h3>
              <button
                onClick={() => setShowColorPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALL_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color)
                    setShowColorPopup(false)
                  }}
                  className={`px-4 py-2 border rounded text-center ${
                    selectedColor === color 
                      ? (isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                      : (isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-500')
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}