'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDarkMode } from '@/context/DarkModeContext'

export default function TermsPage() {
  const { isDarkMode } = useDarkMode()

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1>Terms and Conditions</h1>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using EHR's website, you agree to be bound by these terms and conditions.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</p>

          <h2>3. Pricing and Payment</h2>
          <p>All prices are in Nigerian Naira (₦). We reserve the right to modify prices without notice. Payment is required prior to shipping.</p>

          <h2>4. Shipping Policy</h2>
          <p>Orders are typically processed within 1-2 business days. Shipping times vary by location and selected shipping method.</p>

          <h2>5. Return Policy</h2>
          <p>Items may be returned within 14 days of delivery. Items must be unworn and in original packaging with tags attached.</p>

          <h2>6. Privacy Policy</h2>
          <p>We collect and use personal information as described in our Privacy Policy. By using our service, you consent to such processing.</p>

          <h2>7. Account Security</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>

          <h2>8. Limitations</h2>
          <p>EHR shall not be liable for any indirect, incidental, special, consequential or punitive damages.</p>

          <h2>9. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of Nigeria.</p>

          <h2>10. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>

          <p className="mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}