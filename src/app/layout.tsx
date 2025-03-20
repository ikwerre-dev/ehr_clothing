import { Montserrat } from 'next/font/google'
import { DarkModeProvider } from '@/context/DarkModeContext'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'EHR Clothing',
  description: 'Premium clothing brand for the modern individual',
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