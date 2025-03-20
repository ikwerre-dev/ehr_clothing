'use client'

import { useDarkMode } from '@/context/DarkModeContext'

export function HeroBanner() {
  const { isDarkMode } = useDarkMode()

  return (
    <section className={`relative px-6 py-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button className={`px-8 py-3 rounded-full transition-colors ${
            isDarkMode ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'
          }`}>
            Shop Now
          </button>
          
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-2xl font-bold">200+</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>International Brands</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">2,000+</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>High-quality Products</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">30,000+</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Happy Customers</p>
            </div>
          </div>
        </div>
        
        <div className="relative h-[30rem] overflow-hidden rounded-lg shadow-lg">
          <img
            src="/product2.png"
            alt="Fashion Models"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400">✨</div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 text-yellow-400">✨</div>
        </div>
      </div>
    </section>
  )
}