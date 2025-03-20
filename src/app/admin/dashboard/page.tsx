'use client'

import { useState, useEffect } from 'react'
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: Product
}

interface Order {
  id: string
  total: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  items: OrderItem[]
}

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  _count: {
    orderItems: number
  }
}

interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  recentOrders: Order[]
  popularProducts: Product[]
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    popularProducts: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `₦${(dashboardData.totalRevenue / 1000000).toFixed(1)}M`, 
      icon: CurrencyDollarIcon,
      change: '+12.5%'
    },
    { 
      title: 'Total Orders', 
      value: dashboardData.totalOrders.toString(), 
      icon: ShoppingBagIcon,
      change: '+8.2%'
    },
    { 
      title: 'Total Customers', 
      value: dashboardData.totalCustomers.toString(), 
      icon: UserGroupIcon,
      change: '+15.3%'
    },
    { 
      title: 'Conversion Rate', 
      value: '3.2%', 
      icon: ChartBarIcon,
      change: '+2.1%'
    },
  ]

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">{stat.value}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-emerald-600 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} items • 
                    <span className="text-gray-900">₦{order.total.toLocaleString()}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Products</h2>
          <div className="space-y-4">
            {dashboardData.popularProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 py-2 border-b">
                <div className="w-12 h-12 bg-gray-100 rounded">
                  {product.images[0] && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="text-gray-900">₦{product.price.toLocaleString()}</span> • 
                    <span className="text-blue-600">{product._count.orderItems} sales</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}