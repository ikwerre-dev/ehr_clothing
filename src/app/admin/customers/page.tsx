'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'



// Add these interfaces at the top of the file, after the existing Customer interface
interface OrderItem {
    id: string
    quantity: number
    price: number
    size: string
    color: string
    product: {
        name: string
        price: number
    }
}

interface Order {
    id: string
    reference: string
    total: number
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    createdAt: string
    items: OrderItem[]
}

// Update the Customer interface
interface Customer {
    id: string
    name: string
    email: string
    phone: string
    orders: number
    orderData: Order[] // Replace any[] with Order[]
    totalSpent: number
    lastOrder: string
    status: 'active' | 'inactive'
}
 

export default function CustomersPage() {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 10

    // Fetch customers from the database
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/admin/customers')

                if (!response.ok) {
                    throw new Error('Failed to fetch customers')
                }

                const data = await response.json()

                console.log(data)
 
                interface RawCustomer {
                    id: string
                    name: string
                    email: string
                    phone: string
                    orders: Order[]
                }

                // Update the data transformation
                const formattedCustomers = data.map((customer: RawCustomer) => {
                    // Calculate total spent by summing up all order totals
                    const totalSpent = customer.orders.reduce((sum: number, order: Order) =>
                        sum + (order.total || 0), 0);

                    // Get the most recent order date
                    const lastOrder = customer.orders.length > 0
                        ? new Date(customer.orders[0].createdAt).toLocaleDateString()
                        : 'N/A';

                    return {
                        id: customer.id || '',
                        name: customer.name || 'Unknown',
                        email: customer.email || '',
                        phone: customer.phone || 'N/A',
                        orders: customer.orders.length,
                        orderData: customer.orders,
                        totalSpent,
                        lastOrder,
                        status: customer.orders.length > 0 ? 'active' : 'inactive'
                    };
                });

                setCustomers(formattedCustomers)
            } catch (error) {
                console.error('Error fetching customers:', error)
                toast.error('Failed to load customers')
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    // Filter and search customers
    const filteredCustomers = customers.filter(customer => {
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

            {/* Table with loading state */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedCustomers.length > 0 ? (
                                paginatedCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            <div className="text-sm text-gray-500">ID: {customer.id.substring(0, 8)}</div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedCustomer(customer)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm || statusFilter !== 'all'
                                            ? 'No customers match your search criteria'
                                            : 'No customers found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
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
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1
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
                                        {selectedCustomer.orderData && selectedCustomer.orderData.length > 0 ? (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                     {selectedCustomer.orderData.slice(0, 5).map((order: Order) => (
                                                        <tr key={order.id} className="hover:bg-gray-100">
                                                            <td className="px-4 py-3 text-sm text-gray-900">{order.reference}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                ₦{order.total.toLocaleString()}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'DELIVERED'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : order.status === 'SHIPPED'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No orders found for this customer
                                            </div>
                                        )}
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

                            </div>
                        </div>
                    </div>
                </div>
            )}    </div>
    )
}