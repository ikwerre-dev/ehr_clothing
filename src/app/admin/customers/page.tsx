'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive'
}

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock customers data (in real app, this would come from an API)
  const allCustomers: Customer[] = [
    {
      id: 'CUS001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      orders: 5,
      totalSpent: 150000,
      lastOrder: '2024-01-20',
      status: 'active'
    },
    {
      id: 'CUS002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+234 802 345 6789',
      orders: 3,
      totalSpent: 75000,
      lastOrder: '2024-01-15',
      status: 'active'
    },
    {
      id: 'CUS003',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+234 803 456 7890',
      orders: 8,
      totalSpent: 280000,
      lastOrder: '2024-01-18',
      status: 'active'
    },
    {
      id: 'CUS004',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+234 804 567 8901',
      orders: 2,
      totalSpent: 45000,
      lastOrder: '2024-01-10',
      status: 'inactive'
    },
  ]

  // Filter and search customers
  const filteredCustomers = allCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <div className="flex gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table remains the same, but use paginatedCustomers instead of customers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  <div className="text-sm text-gray-500">ID: {customer.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₦{customer.totalSpent.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.lastOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setSelectedCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredCustomers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === i + 1
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Customer ID</span>
                      <p className="text-gray-900">{selectedCustomer.id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm text-gray-500">Total Orders</span>
                      <p className="text-2xl font-semibold text-gray-900">{selectedCustomer.orders}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm text-gray-500">Total Spent</span>
                      <p className="text-2xl font-semibold text-gray-900">₦{selectedCustomer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[...Array(3)].map((_, i) => (
                          <tr key={i} className="hover:bg-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-900">#{2024001 + i}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{selectedCustomer.lastOrder}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">₦{(45000 + i * 1000).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Delivered
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="space-y-2">
                      <textarea
                        placeholder="Add a note about this customer..."
                        className="w-full p-2 border rounded-lg text-sm"
                        rows={3}
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Add Note
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded border">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">Admin</span>
                          <span className="text-gray-500">2024-01-20</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">Frequent customer, prefers express shipping.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}