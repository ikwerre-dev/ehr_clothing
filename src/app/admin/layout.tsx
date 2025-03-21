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
  CurrencyDollarIcon,
  ChartPieIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  FolderIcon // Add this import
} from '@heroicons/react/24/outline'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (pathname === '/admin/login') {
    return children
  }

  // Show loading state or content based on auth state
  return (
    <>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : isAuthenticated ? (
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg flex flex-col">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">EHR Admin</h1>
            </div>
            <nav className="flex-1 mt-6 space-y-1 px-3">
              <Link href="/admin/dashboard"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/dashboard' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <ChartBarIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>

              <Link href="/admin/products"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/products' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <CubeIcon className="w-5 h-5 mr-3" />
                Products
              </Link>

              <Link href="/admin/categories"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/categories' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <FolderIcon className="w-5 h-5 mr-3" />
                Categories
              </Link>

              <Link href="/admin/orders"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/orders' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <ShoppingBagIcon className="w-5 h-5 mr-3" />
                Orders
              </Link>

              <Link href="/admin/customers"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/customers' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <UserGroupIcon className="w-5 h-5 mr-3" />
                Customers
              </Link>

              <Link href="/admin/transactions"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/transactions' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <CurrencyDollarIcon className="w-5 h-5 mr-3" />
                Transactions
              </Link>

              <Link href="/admin/analytics"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/analytics' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <ChartPieIcon className="w-5 h-5 mr-3" />
                Analytics
              </Link>

              <Link href="/admin/coupons"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${pathname === '/admin/coupons' ? 'bg-gray-100 text-gray-900' : ''
                  }`}>
                <TicketIcon className="w-5 h-5 mr-3" />
                Coupons
              </Link>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={() => {
                  logout();
                  router.push('/admin/login');
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
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
      ) : null}
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}