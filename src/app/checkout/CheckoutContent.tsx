'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CheckoutContent() {
    const router = useRouter()
    const { isDarkMode } = useDarkMode()
    const { items, clearCart } = useCart()
    const [isProcessing, setIsProcessing] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        customerName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Nigeria'
    })

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 2500 // ₦2,500 flat rate
    const total = subtotal + shipping

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            // Create order
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        color: item.color
                    })),
                    total
                }),
            })

            if (!orderResponse.ok) {
                throw new Error('Failed to create order')
            }

            const orderData = await orderResponse.json()

            // Initialize payment
            const paymentResponse = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    amount: total,
                    reference: orderData.reference
                }),
            })

            if (!paymentResponse.ok) {
                throw new Error('Failed to initialize payment')
            }

            const paymentData = await paymentResponse.json()

            // Clear cart and redirect to payment page
            clearCart()
            router.push(paymentData.authorization_url)
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Failed to process checkout. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
        router.push('/cart')
        return null
    }

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Address</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">State</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Country</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.country}
                                            disabled
                                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                                ? 'bg-[#000] border-[#444] text-white'
                                                : 'bg-white border-gray-300 text-black'
                                                } opacity-50`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-3 rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-black text-white hover:bg-[#222]'
                                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg`}>
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={500}
                                                height={500}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-grow">
                                                <h3 className="font-medium">{item.title}</h3>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                    Size: {item.size} | Color: {item.color}
                                                </p>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₦{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₦{shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span>₦{total.toLocaleString()}</span>
                                    </div>
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