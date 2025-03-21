import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true
                        }
                    },
                    items: {
                        include: {
                            product: true
                        }
                    },
                    coupon: true // Include coupon information
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.order.count()
        ])

        // Transform the data to match the expected format

        console.log(orders)

        interface PrismaOrder {
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
            status: string
            userId: string
            addressId: string | null
            createdAt: Date
            updatedAt: Date
            coupon: {
                id: string
                code: string
                discount: number
                type: string
                status: string
            } | null
            user: {
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

        // Update the map function with the type
        const transformedOrders = orders.map((order: PrismaOrder) => {
            // Calculate discount if coupon exists
            const discount = order.coupon ?
                (order.subtotal * (order.coupon.discount / 100)) : 0;

            return {
                id: order.id,
                reference: order.reference,
                customerName: order.customerName,
                email: order.email,
                phone: order.phone,
                address: order.address,
                city: order.city,
                state: order.state,
                paymentMethod: order.paymentMethod,
                total: order.total,
                subtotal: order.subtotal,
                shipping: order.shipping,
                discount: discount,
                coupon: order.coupon ? {
                    id: order.coupon.id,
                    code: order.coupon.code,
                    discount: order.coupon.discount,
                    type: order.coupon.type || 'percentage'
                } : null,
                status: order.status,
                userId: order.userId,
                addressId: order.addressId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                user: {
                    name: order.user.name,
                    email: order.user.email,
                    phone: order.user.phone
                },
                items: order.items.map((item: OrderItem) => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                    product: {
                        name: item.product.name,
                        price: item.product.price
                    }
                }))
            };
        });

        return NextResponse.json({
            orders: transformedOrders,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}


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