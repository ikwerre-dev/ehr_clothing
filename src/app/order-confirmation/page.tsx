'use client'

import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import Link from 'next/link'

export default function OrderConfirmationPage() {
    const { isDarkMode } = useDarkMode()
    const searchParams = useSearchParams()
    const reference = searchParams.get('reference')

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                    <p className="text-xl mb-4">Thank you for your purchase</p>
                    <p className="mb-8">Your order reference number is: <span className="font-bold">{reference}</span></p>
                    <p className="mb-4">You can use this reference number to track your order.</p>
                    <Link 
                        href="/shop" 
                        className={`inline-block px-6 py-3 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'bg-white text-black hover:bg-gray-200' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    )
}