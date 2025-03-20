'use client'

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
          <h1 className="text-2xl font-bold">EHR Admin</h1>
        </div>
        <nav className="mt-6">
          {/* Navigation links */}
          <Link href="/admin/dashboard" 
            className={`flex items-center px-6 py-3 hover:bg-gray-100 ${
              pathname === '/admin/dashboard' ? 'bg-gray-100' : ''
            }`}>
            <ChartBarIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          {/* Add other navigation links */}
        </nav>
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