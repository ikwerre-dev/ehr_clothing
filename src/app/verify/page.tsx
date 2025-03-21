'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reference = searchParams.get('reference')
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)

            const redirect = setTimeout(() => {
                router.push(`/order-confirmation?reference=${reference}`)
            }, 3000)

            return () => {
                clearInterval(timer)
                clearTimeout(redirect)
            }
        }
    }, [status, reference, router])

    const { clearCart } = useCart()


    const verifyPayment = useCallback(async () => {
        try {
            const response = await fetch(`/api/payments/verify?reference=${reference}`)
            const data = await response.json()
    
            if (data.status === 'success') {
                clearCart()
                setStatus('success')
            } else {
                setStatus('failed')
                setError(data.message || 'Payment verification failed')
            }
        } catch (error) {
            setStatus('failed')
            console.error(error)
            setError('An error occurred while verifying payment')
        }
    }, [reference, clearCart])

    useEffect(() => {
        if (!reference) {
            setError('No reference provided')
            setStatus('failed')
            return
        }
        verifyPayment()
    }, [reference, verifyPayment])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Verifying your payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
                        <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
                        <p className="mt-2 text-sm text-gray-500">Redirecting in {countdown} seconds...</p>
                        <Link 
                            href={`/order-confirmation?reference=${reference}`} 
                            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Continue Now
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
                        <p className="mt-2 text-gray-600">{error || 'Something went wrong'}</p>
                        <Link href="/cart" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Return to Cart
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}