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
    const { items } = useCart()
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

    // Add coupon state
    const [couponCode, setCouponCode] = useState('')
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{
        id: string;
        code: string;
        discount: number;
        type: string;
        discountAmount: number;
    } | null>(null)
    const [validatingCoupon, setValidatingCoupon] = useState(false)

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 2500
    
    // Calculate discount if coupon is applied
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
    
    // Calculate total with discount
    const total = subtotal + shipping - discount
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    // const router = useRouter()

    // Handle coupon validation
    const validateCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code')
            return
        }

        setValidatingCoupon(true)
        setCouponError('')
        setCouponSuccess('')

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: couponCode,
                    cartTotal: subtotal
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setCouponError(data.error || 'Invalid coupon code')
                setAppliedCoupon(null)
            } else {
                setCouponSuccess(`Coupon applied: ${data.coupon.type === 'percentage' ? 
                    `${data.coupon.discount}% off` : 
                    `₦${data.coupon.discount.toLocaleString()} off`}`)
                setAppliedCoupon(data.coupon)
            }
        } catch (error) {
            console.error('Error validating coupon:', error)
            setCouponError('Failed to validate coupon')
            setAppliedCoupon(null)
        } finally {
            setValidatingCoupon(false)
        }
    }

    // Remove applied coupon
    const removeCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode('')
        setCouponSuccess('')
        setCouponError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        color: item.color
                    })),
                    customerInfo: formData,
                    total,
                    subtotal,
                    shipping,
                    couponId: appliedCoupon?.id || null,
                    discount: discount
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create order')
            }

            const data = await response.json()
            console.log(data)
            document.location.href = data.paymentUrl
            // router.push(`/order-confirmation?reference=${data.reference}`)
        } catch (error) {
            console.error('Error creating order:', error)
            alert('Failed to place order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
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
                                    value={formData.state}
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
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-lg transition-colors ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : isDarkMode
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-black text-white hover:bg-[#111]'
                            }`}
                        >
                            {isSubmitting ? 'Processing...' : `Place Order (₦${total.toLocaleString()})`}
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

                            {/* Coupon Code Section */}
                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4`}>
                                {appliedCoupon ? (
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-600 font-medium">{couponSuccess}</span>
                                            <button 
                                                onClick={removeCoupon}
                                                className="text-sm text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <label className="block mb-1 text-sm">Have a coupon?</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-grow border border-[#444] rounded-lg p-2 text-sm"
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={validateCoupon}
                                                disabled={validatingCoupon}
                                                className={`px-3 py-2 rounded-lg text-sm ${
                                                    isDarkMode
                                                        ? 'bg-white text-black hover:bg-gray-200'
                                                        : 'bg-black text-white hover:bg-[#333]'
                                                } ${validatingCoupon ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {validatingCoupon ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-sm mt-1">{couponError}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4 space-y-2`}>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₦{shipping.toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₦{discount.toLocaleString()}</span>
                                    </div>
                                )}
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