'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface Order {
    id: string
    createdAt: string
    status: OrderStatus
    totalAmount: number
    user: {
        name: string
        email: string
        phone: string
    }
    orderItems: {
        id: string
        quantity: number
        product: {
            name: string
            price: number
        }
    }[]
    shippingAddress: {
        street: string
        city: string
        state: string
        country: string
    }
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
 
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const itemsPerPage = 10
    
    // Update the fetchOrders function
    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/admin/orders?page=${currentPage}&limit=${itemsPerPage}`)
            if (!response.ok) throw new Error('Failed to fetch orders')
            const data = await response.json()
            setOrders(data.orders)
            setTotalPages(Math.ceil(data.total / itemsPerPage))
        } catch (error) {
            toast.error('Failed to load orders')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Update order status
    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) throw new Error('Failed to update order status')
            
            // Update local state
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ))
            toast.success('Order status updated')
        } catch (error) {
            toast.error('Failed to update order status')
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // Filter and search orders
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        const matchesSearch = searchQuery === '' || 
            order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Orders</h1>
                <div className="flex gap-4">
                    <select className="border rounded-lg px-3 py-2">
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="border rounded-lg px-3 py-2"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₦{order.totalAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-semibold">Order Details - #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">Customer Information</h3>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p className="font-medium text-gray-900">{selectedOrder.user.name}</p>
                                        <p>{selectedOrder.user.phone}</p>
                                        <p>{selectedOrder.user.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900">Shipping Address</h3>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>123 Main Street</p>
                                        <p>Lekki Phase 1</p>
                                        <p>Lagos, Nigeria</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900">Billing Address</h3>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>123 Main Street</p>
                                        <p>Lekki Phase 1</p>
                                        <p>Lagos, Nigeria</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">Order Summary</h3>
                                    <div className="mt-2 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="text-gray-900">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-gray-900">₦2,000</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium border-t pt-2">
                                            <span className="text-gray-900">Total</span>
                                            <span className="text-gray-900">₦{(selectedOrder.totalAmount + 2000).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900">Payment Information</h3>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>Payment Method: Card</p>
                                        <p>Transaction ID: TRX{selectedOrder.id}</p>
                                        <p>Payment Status: Paid</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Notes Section */}
                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Order Notes</h3>
                            <div className="space-y-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900">System</span>
                                        <span className="text-gray-500">2024-01-20 10:30 AM</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Order status changed to Processing</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900">Admin</span>
                                        <span className="text-gray-500">2024-01-20 09:15 AM</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Customer requested express shipping</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <textarea
                                    placeholder="Add a note..."
                                    className="w-full p-2 border rounded-lg text-sm"
                                    rows={2}
                                />
                                <button className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, orders.length)}</span> of{' '}
                            <span className="font-medium">{orders.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === i + 1
                                            ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

    )
}