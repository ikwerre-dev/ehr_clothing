import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Order } from '@prisma/client/wasm'

// Update the type definitions to match your actual schema
type OrderWithRelations = Order & {
    reference: string;
    customerName: string | null;
    email: string | null;
    user?: { name: string | null; email: string | null } | null;
    items: Array<{
        product: {
            name: string;
            price: number;
            images: string[];
        }
    }>;
}

// Uncomment and update the ProductWithRelations type
type ProductWithRelations = {
    id: string;
    name: string;
    price: number;
    images: string[];
    _count: {
        orderItems: number;
    };
    orderItems: Array<{
        order: {
            createdAt: Date;
        }
    }>;
}

export async function GET() {
    try {
        // Get current date and date 30 days ago for monthly stats
        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 30)

        const [
            totalRevenue,
            totalOrders,
            totalCustomers,
            recentOrders,
            popularProducts,
            monthlySales,
            ordersByStatus
        ] = await Promise.all([
            // Total revenue from paid orders
            prisma.order.aggregate({
                _sum: {
                    total: true
                },
                where: {
                    paymentStatus: 'PAID'
                }
            }),

            // Total orders count
            prisma.order.count(),

            // Total customers count
            prisma.user.count({
                where: {
                    role: 'USER'
                }
            }),

            // Recent orders with customer and product details
            prisma.order.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true,
                                    images: true
                                }
                            }
                        }
                    }
                }
            }),

            // Popular products by order count - Fixed the images field issue
            prisma.product.findMany({
                take: 5,
                orderBy: {
                    orderItems: {
                        _count: 'desc'
                    }
                },
                include: {
                    _count: {
                        select: {
                            orderItems: true
                        }
                    },
                    orderItems: {
                        take: 1,
                        include: {
                            order: {
                                select: {
                                    createdAt: true
                                }
                            }
                        }
                    }
                }
            }),

            // Monthly sales for the last 30 days
            prisma.order.groupBy({
                by: ['createdAt'],
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo
                    }
                },
                _sum: {
                    total: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }),

            // Orders by status
            prisma.order.groupBy({
                by: ['status'],
                _count: true
            })
        ])

        // Format the data for the frontend
        const formattedRecentOrders = recentOrders.map((order: OrderWithRelations) => ({
            id: order.id,
            reference: order.reference,
            customerName: order.customerName || order.user?.name || 'Guest',
            email: order.email || order.user?.email || 'N/A',
            total: order.total,
            status: order.status,
            date: order.createdAt,
            items: order.items.length
        }))

        const formattedPopularProducts = popularProducts.map((product: ProductWithRelations) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || null,
            orderCount: product._count?.orderItems || 0,
            lastOrdered: product.orderItems?.[0]?.order?.createdAt || null
        }))

        // Group monthly sales by day
        const salesByDay = monthlySales.reduce((acc: Record<string, number>, { createdAt, _sum }: { createdAt: Date, _sum: { total: number | null } }) => {
            const date = new Date(createdAt).toISOString().split('T')[0]
            acc[date] = (_sum.total || 0) + (acc[date] || 0)
            return acc
        }, {})

        // Convert to array format for charts
        const monthlySalesData = Object.entries(salesByDay).map(([date, total]) => ({
            date,
            total
        }))

        return NextResponse.json({
            totalRevenue: totalRevenue._sum.total || 0,
            totalOrders,
            totalCustomers,
            recentOrders: formattedRecentOrders,
            popularProducts: formattedPopularProducts,
            monthlySales: monthlySalesData,
            ordersByStatus
        })
    } catch (error) {
        console.error('Dashboard error:', error)
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
    }
}