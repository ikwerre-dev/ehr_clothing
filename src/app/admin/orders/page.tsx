'use client'

import { useState } from 'react'
import { EyeIcon, XMarkIcon, TruckIcon, CreditCardIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { toast, Toaster } from 'react-hot-toast'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface Order {
    id: string
    reference: string
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    paymentMethod: string
    total: number
    subtotal: number
    shipping: number
    discount?: number
    coupon?: {
        id: string
        code: string
        discount: number
        type: string
    } | null
    status: OrderStatus
    createdAt: string
    updatedAt: string
    user: {
        id: string
        name: string
        email: string
        phone: string
    }
    items: {
        id: string
        quantity: number
        price: number
        size: string
        color: string
        product: {
            name: string
            price: number
        }
    }[]
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const itemsPerPage = 10

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
        }
    }

    // Update order status
    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            toast.success(`Processing`, {
                duration: 4000,
                position: 'top-center',
                icon: '🔔',

            })
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



            toast.success(`Order status updated to ${newStatus.toUpperCase()}`, {
                duration: 4000,
                position: 'top-center',
                icon: '🔔',

            })
            // Send email notification
            await fetch('/api/notifications/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    reference: selectedOrder?.reference,
                    status: newStatus,
                    email: selectedOrder?.email,
                    customerName: selectedOrder?.customerName
                }),
            })



        } catch (error) {
            toast.error('Failed to update order status')
            console.error(error)
        }
    }

    fetchOrders()

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


    console.log(selectedOrder)
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Orders</h1>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₦{order.total?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.coupon ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            {order.coupon.code} ({order.discount ? `₦${order.discount.toLocaleString()}` : '0'})
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm min-h-screen z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold">Order #{selectedOrder.reference}</h2>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-8">
                                {/* Order Items */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <TruckIcon className="w-5 h-5 text-gray-600" />
                                        Order Items
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <CreditCardIcon className="w-5 h-5 text-gray-600" />
                                        Payment Details
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span>₦{selectedOrder.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span>₦{selectedOrder.shipping.toLocaleString()}</span>
                                        </div>
                                        {selectedOrder.discount && selectedOrder.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount {selectedOrder.coupon && `(${selectedOrder.coupon.code})`}</span>
                                                <span>-₦{selectedOrder.discount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t font-medium">
                                            <span>Total</span>
                                            <span>₦{selectedOrder.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <UserIcon className="w-5 h-5 text-gray-600" />
                                        Customer Details
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{selectedOrder.customerName}</p>
                                        <p className="text-gray-600">{selectedOrder.email}</p>
                                        <p className="text-gray-600">{selectedOrder.phone}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <MapPinIcon className="w-5 h-5 text-gray-600" />
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-gray-600">{selectedOrder.address}</p>
                                        <p className="text-gray-600">{selectedOrder.city}</p>
                                        <p className="text-gray-600">{selectedOrder.state}</p>
                                    </div>
                                </div>

                                {/* Order Status */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Update Status</h3>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                                        className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
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
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1
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
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    duration: 4000,
                }}

            />
        </div>
    )
}
