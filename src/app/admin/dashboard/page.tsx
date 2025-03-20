'use client'

import { useState } from 'react'
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: '₦2.4M', icon: CurrencyDollarIcon, change: '+12.5%' },
    { title: 'Total Orders', value: '156', icon: ShoppingBagIcon, change: '+8.2%' },
    { title: 'Total Customers', value: '2.1K', icon: UserGroupIcon, change: '+15.3%' },
    { title: 'Conversion Rate', value: '3.2%', icon: ChartBarIcon, change: '+2.1%' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Order #{2024001 + i}</p>
                  <p className="text-sm text-gray-500">2 items • ₦45,000</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  i % 3 === 0 ? 'bg-green-100 text-green-800' :
                  i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {i % 3 === 0 ? 'Delivered' : i % 3 === 1 ? 'Processing' : 'Shipped'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b">
                <div className="w-12 h-12 bg-gray-100 rounded" />
                <div className="flex-1">
                  <p className="font-medium">Product Name {i + 1}</p>
                  <p className="text-sm text-gray-500">₦{(15000 + i * 1000).toLocaleString()} • {50 - i * 5} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}