'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

export default function FAQContent() {
    const { isDarkMode } = useDarkMode()

    const faqs = [
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit/debit cards and bank transfers through our secure payment gateway."
        },
        {
            question: "How long does shipping take?",
            answer: "Shipping typically takes 3-5 business days within Nigeria. International shipping may take longer depending on the destination."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 14 days of delivery. Items must be unused and in their original packaging."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order on our website using your order reference number."
        }
    ]

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Disclosure key={index}>
                                {({ open }) => (
                                    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
                                        <Disclosure.Button className="flex justify-between w-full px-4 py-4 text-left">
                                            <span className="font-medium">{faq.question}</span>
                                            <ChevronUpIcon
                                                className={`${open ? 'transform rotate-180' : ''
                                                    } w-5 h-5`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pb-4">
                                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                {faq.answer}
                                            </p>
                                        </Disclosure.Panel>
                                    </div>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}