'use client'

import { useDarkMode } from '@/context/DarkModeContext'

export function Categories() {
    const { isDarkMode } = useDarkMode()

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-white' : 'bg-black'} text-white`}>
            <div className="container mx-auto px-6">
                <h2 className={` ${isDarkMode ? 'text-black' : 'text-white'} text-3xl font-bold mb-8`}>Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative overflow-hidden rounded-lg aspect-square group">
                        <img src="/product1.png" alt="Casual Wear" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            <h3 className="text-xl font-bold">Casual Wear</h3>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg aspect-square group">
                        <img src="/product2.png" alt="Formal Wear" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            <h3 className="text-xl font-bold">Formal Wear</h3>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg aspect-square group">
                        <img src="/product1.png" alt="Accessories" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                            <h3 className="text-xl font-bold">Accessories</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}