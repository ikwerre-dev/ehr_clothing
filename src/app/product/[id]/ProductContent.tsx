'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { Product } from '@prisma/client'

interface ProductContentProps {
    product: Product & {
        images: string[];
        category: {
            name: string;
        };
    }
}

export default function ProductContent({ product }: ProductContentProps) {
    const { isDarkMode } = useDarkMode()
    const { addItem } = useCart()
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)

    const sizes = ['S', 'M', 'L', 'XL', 'XXL']
    const colors = ['Black', 'White', 'Gray', 'Navy']

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select both size and color')
            return
        }

        addItem({
            id: product.id,
            title: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
            quantity
        })

        alert('Added to cart!')
    }

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="aspect-square relative">
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square relative rounded-lg overflow-hidden ${
                                            selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                                <p className="text-2xl font-semibold mb-4">₦{product.price.toLocaleString()}</p>
                                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    {product.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Size</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-2 rounded-lg border ${
                                                selectedSize === size
                                                    ? isDarkMode
                                                        ? 'bg-white text-black'
                                                        : 'bg-black text-white'
                                                    : isDarkMode
                                                    ? 'border-[#444] hover:border-white'
                                                    : 'border-gray-300 hover:border-black'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Color</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`py-2 rounded-lg border ${
                                                selectedColor === color
                                                    ? isDarkMode
                                                        ? 'bg-white text-black'
                                                        : 'bg-black text-white'
                                                    : isDarkMode
                                                    ? 'border-[#444] hover:border-white'
                                                    : 'border-gray-300 hover:border-black'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Quantity</h3>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className={`w-10 h-10 rounded-lg border ${
                                            isDarkMode ? 'border-[#444]' : 'border-gray-300'
                                        }`}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className={`w-10 h-10 rounded-lg border ${
                                            isDarkMode ? 'border-[#444]' : 'border-gray-300'
                                        }`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-3 rounded-lg transition-colors ${
                                    isDarkMode
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-black text-white hover:bg-[#222]'
                                }`}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}