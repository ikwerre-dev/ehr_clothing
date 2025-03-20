'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import Link from 'next/link'

export function Footer() {
  const { isDarkMode } = useDarkMode()

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">EHR</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              We are committed to delivering premium quality clothing that reflects your unique style.
            </p>
            <div className="flex gap-4">
              <Link href="#" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>Instagram</Link>
              <Link href="#" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>Facebook</Link>
              <Link href="#" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>Twitter</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/all" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>All Products</Link></li>
              <li><Link href="/new" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>New Arrivals</Link></li>
              <li><Link href="/best" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>Best Sellers</Link></li>
              <li><Link href="/sale" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>On Sale</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
               <li><Link href="/faq" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>FAQs</Link></li>
               <li><Link href="/tracking" className={`${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>Email: contact@ehr.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Mon - Fri: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-12 pt-8 text-center`}>
          <p>© 2024 EHR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}