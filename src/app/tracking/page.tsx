'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { MagnifyingGlassIcon, TruckIcon, CheckCircleIcon,  ClockIcon } from '@heroicons/react/24/outline'
import { Package } from 'lucide-react'

type TrackingStatus = 'processing' | 'shipped' | 'out-for-delivery' | 'delivered'

interface TrackingStep {
  status: TrackingStatus
  title: string
  date: string
  description: string
  isCompleted: boolean
  icon: typeof TruckIcon
}

export default function TrackingPage() {
  const { isDarkMode } = useDarkMode()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showTracking, setShowTracking] = useState(false)

  const trackingSteps: TrackingStep[] = [
    {
      status: 'processing',
      title: 'Order Processing',
      date: '2024-01-20 09:00 AM',
      description: 'Your order has been confirmed and is being processed',
      isCompleted: true,
      icon: ClockIcon
    },
    {
      status: 'shipped',
      title: 'Order Shipped',
      date: '2024-01-21 02:30 PM',
      description: 'Your package has been shipped from our warehouse',
      isCompleted: true,
      icon: Package
    },
    {
      status: 'out-for-delivery',
      title: 'Out for Delivery',
      date: '2024-01-22 08:45 AM',
      description: 'Your package is out for delivery',
      isCompleted: true,
      icon: TruckIcon
    },
    {
      status: 'delivered',
      title: 'Delivered',
      date: 'Estimated: 2024-01-22 05:00 PM',
      description: 'Package will be delivered to your address',
      isCompleted: false,
      icon: CheckCircleIcon
    }
  ]

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
      setShowTracking(true)
    }, 1500)
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
                    placeholder="e.g., EHR123456789"
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 text-white placeholder:text-gray-400' 
                        : 'bg-white text-black placeholder:text-gray-500'
                    }`}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!trackingNumber || isSearching}
                className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isDarkMode 
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

            {showTracking && (
              <div className="mt-8 space-y-8">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="font-medium mb-2">Order Details</h3>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Tracking Number: {trackingNumber}</p>
                    <p>Estimated Delivery: Jan 22, 2024</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {trackingSteps.map((step, index) => (
                    <div key={step.status} className="relative">
                      {index !== trackingSteps.length - 1 && (
                        <div 
                          className={`absolute left-6 top-10 w-0.5 h-full ${
                            step.isCompleted ? 'bg-green-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                          }`}
                        />
                      )}
                      <div className="flex gap-4">
                      <div className=" flex flex-col items-center justify-center">
                      <div className={`rounded-full flex p-2 ${
                          step.isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                        }`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                      </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {step.date}
                          </p>
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

            {!showTracking && (
              <div className="mt-8">
                <h2 className="font-medium mb-4">How to track your order:</h2>
                <ol className={`list-decimal list-inside space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Enter the tracking number from your order confirmation email</li>
                  <li>Click the "Track Order" button</li>
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