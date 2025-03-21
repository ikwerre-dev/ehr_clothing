'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { useSearchParams } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function OrderConfirmationContent() {
    const { isDarkMode } = useDarkMode()
    const searchParams = useSearchParams()
    const reference = searchParams?.get('reference') // Add null check
    const [isVerifying, setIsVerifying] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (!searchParams) return // Add early return if searchParams is not available
        if (reference) {
            verifyPayment(reference)
        }
    }, [reference, searchParams]) // Add searchParams to dependencies

    const verifyPayment = async (reference: string) => {
        try {
            const response = await fetch(`/api/payments/verify?reference=${reference}`)
            const data = await response.json()
            setIsSuccess(data.status === 'success')
        } catch (error) {
            console.error('Payment verification error:', error)
            setIsSuccess(false)
        } finally {
            setIsVerifying(false)
        }
    }

    if (isVerifying) {
        return (
            <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4">Verifying your payment...</p>
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
                <div className="max-w-2xl mx-auto text-center">
                    {isSuccess ? (
                        <>
                            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
                            <p className="mb-8 text-lg">
                                Your payment was successful and your order is being processed.
                                We&apos;ve sent you an email with your order details.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                                <span className="text-red-500 text-4xl">x</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
                            <p className="mb-8 text-lg">
                                We couldn&apos;t process your payment. Please try again or contact support if the problem persists.
                            </p>
                        </>
                    )}

                    <div className="space-x-4">
                        <Link
                            href="/shop"
                            className={`inline-block px-6 py-3 rounded-lg ${
                                isDarkMode
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-black text-white hover:bg-[#222]'
                            }`}
                        >
                            Continue Shopping
                        </Link>
                        {!isSuccess && (
                            <Link
                                href="/contact"
                                className={`inline-block px-6 py-3 rounded-lg border ${
                                    isDarkMode
                                        ? 'border-white text-white hover:bg-white hover:text-black'
                                        : 'border-black text-black hover:bg-black hover:text-white'
                                }`}
                            >
                                Contact Support
                            </Link>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}