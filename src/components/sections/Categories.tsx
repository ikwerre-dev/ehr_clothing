'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CategoryWithProduct {
    id: string
    name: string
    latestProduct: {
        id: string
        name: string
        images: string[]
    }
}

export function Categories() {
    const { isDarkMode } = useDarkMode()
    const [categories, setCategories] = useState<CategoryWithProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories?limit=3')
                const data = await response.json()
                setCategories(data)
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (isLoading) {
        return <div className="py-16">Loading categories...</div>
    }

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-white' : 'bg-black'} text-white`}>
            <div className="container mx-auto px-6">
                <h2 className={`${isDarkMode ? 'text-black' : 'text-white'} text-3xl font-bold mb-8`}>Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            href={`/shop?category=${category.id}`}
                            key={category.id}
                            className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
                        >
                            <Image
                                width={200}
                                height={200}
                                src={category.latestProduct?.images[0] || '/placeholder.png'}
                                alt={category.name}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 text-white`}>
                                <h3 className="text-xl font-bold">{category.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}