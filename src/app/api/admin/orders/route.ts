import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    try {
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true,
                                },
                            },
                        },
                    },
                    shippingAddress: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.order.count(),
        ])

        return NextResponse.json({
            orders,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}