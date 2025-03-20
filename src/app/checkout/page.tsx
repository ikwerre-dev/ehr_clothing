'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { useDarkMode } from '@/context/DarkModeContext'
import Link from 'next/link'
import Image from 'next/image'

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

    if (items.length === 0) {
        return (
            <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <Link href="/shop" className="text-blue-600 hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-[#444] rounded-lg p-2"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-[#444] rounded-lg p-2"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full border border-[#444] rounded-lg p-2"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Phone</label>
                            <input
                                type="tel"
                                required
                                className="w-full border border-[#444] rounded-lg p-2"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Address</label>
                            <textarea
                                required
                                className="w-full border border-[#444] rounded-lg p-2"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-[#444] rounded-lg p-2"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">State</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-[#444] rounded-lg p-2"
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}

                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1">Payment Method</label>
                            <select
                                className="w-full border border-[#444] rounded-lg p-2"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            >
                                <option value="card">Card Payment</option>
                                <option value="transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-black text-white hover:bg-[#111]'
                                }`}
                        >
                            Place Order (₦{total.toLocaleString()})
                        </button>
                    </form>

                    <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-gray-100'} p-6 rounded-lg h-fit sticky top-4`}>
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                                    <Image src={item.image} alt={item.title} width={50} height={50} className="w-16 h-16 object-cover rounded" />
                                    <div>
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Size: {item.size}, Color: {item.color}, Qty: {item.quantity}
                                        </p>
                                        <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}

                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4 space-y-2`}>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₦{shipping.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>₦{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}