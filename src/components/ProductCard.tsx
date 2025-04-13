'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useDarkMode } from '@/context/DarkModeContext'
import Image from 'next/image'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  discount?: number
}

export function ProductCard({ id, title, price, originalPrice, rating, image, discount }: ProductCardProps) {
  const { isDarkMode } = useDarkMode()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Handle successful image load

  console.log(imageError)
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  // Handle image load failure
  const handleImageError = () => {
    setImageLoaded(false)
    setImageError(true)
  }

  return (
    <Link href={`/product/${id}`} className={`group border pb-5 rounded-lg ${isDarkMode ? 'border-[#222]' : 'border-[#666]'}`}>
      <div className="aspect-square overflow-hidden rounded-lg relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rounded-full bg-gray-300 animate-ripple"></div>
              <div className="absolute inset-0 rounded-full bg-gray-300 animate-ripple delay-200"></div>
              <div className="absolute inset-0 rounded-full bg-gray-300 animate-ripple delay-400"></div>
            </div>
          </div>
        )}
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className={`h-full w-full object-cover object-center group-hover:scale-105 transition-transform ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <div className="mt-4 px-5">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-200'}`}
              />
            ))}
          </div>
          {/* <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({reviewCount})</span> */}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium">₦{price.toLocaleString()}</span>
          {originalPrice && (
            <span className={`text-sm line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ₦{originalPrice.toLocaleString()}
            </span>
          )}
          {discount && (
            <span className="text-sm text-red-600">-{discount}%</span>
          )}
        </div>
      </div>
    </Link>
  )
}