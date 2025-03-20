'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { useDarkMode } from '@/context/DarkModeContext'

export default function CheckoutPage() {
  const { isDarkMode } = useDarkMode()
  const { items, clearCart } = useCart()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    paymentMethod: 'card'
  })

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 2500
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment processing here
    alert('Order placed successfully!')
    clearCart()
    // Redirect to success page or home
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border rounded-lg p-2"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              required
              className="w-full border rounded-lg p-2"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <textarea
              required
              className="w-full border rounded-lg p-2"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1">State</label>
              <input
                type="text"
                required
                className={`w-full rounded-lg p-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Payment Method</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="card">Card Payment</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Place Order (₦{total.toLocaleString()})
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}