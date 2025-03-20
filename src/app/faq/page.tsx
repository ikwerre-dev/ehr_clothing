'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const FAQs = [
  {
    question: 'How does shopping on EHR work?',
    answer: 'Browse our collection, select your items, choose size and color, add to cart, and proceed to checkout. We accept various payment methods and offer secure transactions.'
  },
  {
    question: 'What are your shipping options?',
    answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free shipping is available for orders over ₦50,000.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 14 days of delivery. Items must be unworn and in original packaging. Contact our customer service for return authorization.'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. Use this to track your package on our website.'
  },
  {
    question: 'Are the sizes true to fit?',
    answer: 'Yes, our sizes follow standard Nigerian measurements. Check our size guide for detailed measurements to find your perfect fit.'
  }
]

export default function FAQPage() {
  const { isDarkMode } = useDarkMode()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-4">
            {FAQs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className={`px-6 pb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}