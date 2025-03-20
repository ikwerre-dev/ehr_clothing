'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import { useState } from 'react'

export function Newsletter() {
  const { isDarkMode } = useDarkMode()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    alert('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-900'}`}>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
          Get exclusive offers, new arrivals updates, and style inspiration directly to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`flex-1 px-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800 text-white placeholder:text-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500'
            }`}
            required
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}