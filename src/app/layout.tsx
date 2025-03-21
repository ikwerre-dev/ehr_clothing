import { Montserrat } from 'next/font/google'
import { DarkModeProvider } from '@/context/DarkModeContext'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'] })

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EHR Clothing',
  metadataBase: new URL('https://ehrclothing.store'),
  description: 'Premium quality clothing that reflects your unique style',
  openGraph: {
    title: 'EHR Clothing',
    description: 'Premium quality clothing that reflects your unique style',
    url: 'https://ehr-clothing.com',
    siteName: 'EHR Clothing',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EHR Clothing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EHR Clothing',
    description: 'Premium quality clothing that reflects your unique style',
    images: ['/og-image.jpg'],
  },
}

import { CartProvider } from '@/context/CartContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <DarkModeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}

