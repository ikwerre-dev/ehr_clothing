'use client'

import { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import Image from 'next/image'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

interface AnalyticsData {
    stats: {
        totalRevenue: number
        totalOrders: number
        totalCustomers: number
        avgOrderValue: number
    }
    salesTrend: {
        labels: string[]
        data: number[]
    }
    salesByCategory: {
        labels: string[]
        data: number[]
    }
    customerTypes: {
        new: number
        returning: number
    }
    topProducts: Array<{
        id: string
        name: string
        price: number
        image: string | null
        sales: number
        percentageOfSales: number
    }>
}

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('7days')
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
                if (!response.ok) throw new Error('Failed to fetch analytics')
                const data = await response.json()
                setAnalyticsData(data)
            } catch (error) {
                console.error('Error fetching analytics:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalyticsData()
    }, [timeRange])

    // Format numbers for display
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `₦${(amount / 1000000).toFixed(1)}M`
        } else if (amount >= 1000) {
            return `₦${(amount / 1000).toFixed(1)}K`
        }
        return `₦${amount.toLocaleString()}`
    }

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    // Prepare chart data
    const salesData = {
        labels: analyticsData?.salesTrend.labels || [],
        datasets: [
            {
                label: 'Sales',
                data: analyticsData?.salesTrend.data || [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    }

    const categoryData = {
        labels: analyticsData?.salesByCategory.labels || [],
        datasets: [
            {
                data: analyticsData?.salesByCategory.data || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
            },
        ],
    }

    const customerData = {
        labels: ['New', 'Returning'],
        datasets: [
            {
                data: analyticsData ? [analyticsData.customerTypes.new, analyticsData.customerTypes.returning] : [0, 0],
                backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
            },
        ],
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analytics data...</p>
                </div>
            </div>
        )
    }

    const stats = [
        {
            label: 'Total Revenue',
            value: formatCurrency(analyticsData?.stats.totalRevenue || 0),
            change: '+12.5%'
        },
        {
            label: 'Orders',
            value: analyticsData?.stats.totalOrders.toString() || '0',
            change: '+8.2%'
        },
        {
            label: 'Customers',
            value: formatNumber(analyticsData?.stats.totalCustomers || 0),
            change: '+15.3%'
        },
        {
            label: 'Avg. Order Value',
            value: formatCurrency(analyticsData?.stats.avgOrderValue || 0),
            change: '+4.1%'
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Analytics</h1>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                        <p className="text-sm mt-2">
                            <span className="text-green-600">{stat.change}</span>
                            <span className="text-gray-500 ml-2">vs last period</span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
                    <Line data={salesData} options={{ responsive: true }} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
                    <Bar
                        data={categoryData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Customer Types</h2>
                    <div className="w-1/2 mx-auto">
                        <Doughnut data={customerData} options={{ responsive: true }} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Top Products</h2>
                    <div className="space-y-4">
                        {analyticsData?.topProducts && analyticsData.topProducts.length > 0 ? (
                            analyticsData.topProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {product.image ? (
                                            <Image
                                                width={150}
                                                height={150}
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(product.price)} • {product.sales} sales
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {product.percentageOfSales}% of sales
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                No product data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}