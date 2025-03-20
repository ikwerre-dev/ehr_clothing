'use client'
import './globals.css'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext'
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  TicketIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, pathname])

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  if (pathname === '/admin/login') {
    return children
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">EHR Admin</h1>
        </div>
        <nav className="mt-6 space-y-1">
          <Link href="/admin/dashboard" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
              pathname === '/admin/dashboard' ? 'bg-gray-100 text-gray-900' : ''
            }`}>
            <ChartBarIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          
          <Link href="/admin/products" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
              pathname === '/admin/products' ? 'bg-gray-100 text-gray-900' : ''
            }`}>
            <CubeIcon className="w-5 h-5 mr-3" />
            Products
          </Link>

          <Link href="/admin/orders" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
              pathname === '/admin/orders' ? 'bg-gray-100 text-gray-900' : ''
            }`}>
            <ShoppingBagIcon className="w-5 h-5 mr-3" />
            Orders
          </Link>

          <Link href="/admin/transactions" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
              pathname === '/admin/transactions' ? 'bg-gray-100 text-gray-900' : ''
            }`}>
            <CurrencyDollarIcon className="w-5 h-5 mr-3" />
            Transactions
          </Link>

          <Link href="/admin/analytics" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
              pathname === '/admin/analytics' ? 'bg-gray-100 text-gray-900' : ''
            }`}>
            <ChartPieIcon className="w-5 h-5 mr-3" />
            Analytics
          </Link>

          <Link href="/admin/coupons" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
              pathname === '/admin/coupons' ? 'bg-gray-100 text-gray-900' : ''
            }`}>
            <TicketIcon className="w-5 h-5 mr-3" />
            Coupons
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={() => {
              // Add logout logic here
            }}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}