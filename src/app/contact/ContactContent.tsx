'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
    const { isDarkMode } = useDarkMode()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            alert('Message sent successfully!')
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (error) {
            console.log(error)
            alert('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <EnvelopeIcon className="w-6 h-6" />
                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <PhoneIcon className="w-6 h-6" />
                                <div>
                                    <h3 className="font-medium">Phone</h3>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{process.env.NEXT_PUBLIC_ADMIN_PHONE}</p>
                                </div>
                            </div>


                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                        ? 'bg-[#000] border-[#444] text-white'
                                        : 'bg-white border-gray-300 text-black'
                                        }`}
                                />
                            </div>

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
                                <label className="block mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                        ? 'bg-[#000] border-[#444] text-white'
                                        : 'bg-white border-gray-300 text-black'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                                        ? 'bg-[#000] border-[#444] text-white'
                                        : 'bg-white border-gray-300 text-black'
                                        }`}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg transition-colors ${
                                    isDarkMode
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-black text-white hover:bg-[#222]'
                                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}