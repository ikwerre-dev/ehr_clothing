'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { MagnifyingGlassIcon, TruckIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { IdentificationIcon, UserIcon, CalendarIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Package } from 'lucide-react'
import type { SVGProps } from 'react'


type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

// Add this import for the icon types
import { ComponentType } from 'react'

// Update the TrackingStep interface
interface TrackingStep {
    status: OrderStatus
    title: string
    description: string
    isCompleted: boolean
    icon: ComponentType<SVGProps<SVGSVGElement>>
}

// Add OrderData interface
interface OrderData {
    id: string
    reference: string
    customerName: string
    email: string
    status: OrderStatus
    total: number
    createdAt: string
}

export default function TrackingContent() {
    const { isDarkMode } = useDarkMode()
    const [trackingNumber, setTrackingNumber] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState('')
    const [orderData, setOrderData] = useState<OrderData | null>(null)

    const getTrackingSteps = (status: OrderStatus): TrackingStep[] => {
        const steps: TrackingStep[] = [
            {
                status: 'PENDING',
                title: 'Order Received',
                description: 'Your order has been received and is awaiting processing',
                isCompleted: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status),
                icon: ClockIcon
            },
            {
                status: 'PROCESSING',
                title: 'Order Processing',
                description: 'Your order is being processed',
                isCompleted: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status),
                icon: Package
            },
            {
                status: 'SHIPPED',
                title: 'Order Shipped',
                description: 'Your package is on its way',
                isCompleted: ['SHIPPED', 'DELIVERED'].includes(status),
                icon: TruckIcon
            },
            {
                status: 'DELIVERED',
                title: 'Delivered',
                description: 'Your package has been delivered',
                isCompleted: ['DELIVERED'].includes(status),
                icon: CheckCircleIcon
            }
        ]

        if (status === 'CANCELLED') {
            return [
                {
                    status: 'CANCELLED',
                    title: 'Order Cancelled',
                    description: 'This order has been cancelled',
                    isCompleted: true,
                    icon: XCircleIcon
                }
            ]
        }

        return steps
    }

    const handleTracking = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSearching(true)
        setError('')
        setOrderData(null)

        try {
            const response = await fetch(`/api/tracking?reference=${trackingNumber}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch order')
            }

            setOrderData(data)
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsSearching(false);
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

                    <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <form onSubmit={handleTracking} className="space-y-6">
                            <div>
                                <label htmlFor="tracking" className="block mb-2 font-medium">
                                    Enter your tracking number
                                </label>
                                <div className="relative">
                                    <input
                                        id="tracking"
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="e.g., EHR-VAIDQH"
                                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode
                                            ? 'bg-gray-800 text-white placeholder:text-gray-400'
                                            : 'bg-white text-black placeholder:text-gray-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!trackingNumber || isSearching}
                                className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${isDarkMode
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-black text-white hover:bg-gray-800'
                                    } ${(!trackingNumber || isSearching) && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {isSearching ? (
                                    <>
                                        <MagnifyingGlassIcon className="w-5 h-5 animate-spin" />
                                        Tracking...
                                    </>
                                ) : (
                                    'Track Order'
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {orderData && (
                            <div className="mt-8 space-y-8">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h3 className="font-medium mb-2">Order Details</h3>
                                    <div className={`text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <p className="flex items-center gap-2">
                                            <IdentificationIcon className="w-5 h-5" />
                                            <span className="font-bold">Reference:</span> {orderData.reference}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <UserIcon className="w-5 h-5" />
                                            <span className="font-bold">Customer:</span> {orderData.customerName}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <CalendarIcon className="w-5 h-5" />
                                            <span className="font-bold">Order Date:</span> {formatDate(orderData.createdAt)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <TagIcon className="w-5 h-5" />
                                            <span className="font-bold">Status:</span> {orderData.status}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <CurrencyDollarIcon className="w-5 h-5" />
                                            <span className="font-bold">Total:</span> ₦{orderData.total.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {getTrackingSteps(orderData.status).map((step, index, steps) => (
                                        <div key={step.status} className="relative">
                                            {index !== steps.length - 1 && (
                                                <div
                                                    className={`absolute left-6 top-10 w-0.5 h-full ${step.isCompleted ? 'bg-green-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                                                        }`}
                                                />
                                            )}
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className={`rounded-full flex p-2 ${step.isCompleted
                                                        ? step.status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                                                        }`}>
                                                        <step.icon className="w-6 h-6" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{step.title}</h4>
                                                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!orderData && !error && !isSearching && (
                            <div className="mt-8">
                                <h2 className="font-medium mb-4">How to track your order:</h2>
                                <ol className={`list-decimal list-inside space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>Enter the tracking number from your order confirmation email</li>
                                    <li>Click the &rdquo;Track Order&rdquo; button</li>
                                    <li>View real-time updates on your order status</li>
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}