'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/context/DarkModeContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export function Header() {
  const { isDarkMode } = useDarkMode()
  const { totalItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative">
      <div className="bg-black text-white py-2 px-4 text-center text-sm">
        <p>Sign up and get 20% off to your first order. <Link href="/signup" className="underline">Sign Up Now</Link></p>
      </div>
      
      <div className={`flex items-center justify-between px-6 py-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Link href="/" className="text-2xl font-bold">E.H.R</Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Shop</Link>
          <Link href="/on-sale" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>On Sale</Link>
          <Link href="/new-arrivals" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>New Arrivals</Link>
          <Link href="/brands" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Brands</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Search for products..."
              className={`pl-10 pr-4 py-2 rounded-full ${
                isDarkMode ? 'bg-gray-800 text-white placeholder:text-gray-400' : 'bg-gray-100 text-gray-900 placeholder:text-gray-500'
              }`}
            />
            <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          
          <ThemeToggle />
          <UserIcon className="w-6 h-6 cursor-pointer" />
          
          <Link href="/cart" className="relative">
            <ShoppingBagIcon className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="px-6 py-4">
            <div className="relative mb-4">
              <input
                type="search"
                placeholder="Search for products..."
                className={`w-full pl-10 pr-4 py-2 rounded-full ${
                  isDarkMode ? 'bg-gray-800 text-white placeholder:text-gray-400' : 'bg-gray-100 text-gray-900 placeholder:text-gray-500'
                }`}
              />
              <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/shop" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Shop</Link>
              <Link href="/on-sale" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>On Sale</Link>
              <Link href="/new-arrivals" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>New Arrivals</Link>
              <Link href="/brands" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Brands</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}