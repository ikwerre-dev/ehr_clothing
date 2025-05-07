import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const [newArrivals, bestSellers, regularProducts] = await Promise.all([
            prisma.product.findMany({
                where: {
                    createdAt: { gte: thirtyDaysAgo }
                },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                take: 8,
            }),
            prisma.product.findMany({
                include: {
                    category: true,
                    orderItems: true,
                },
                orderBy: {
                    orderItems: {
                        _count: 'desc'
                    }
                },
                take: 8,
            }),
            prisma.product.findMany({
                include: { category: true },
            })
        ])

        const featured = regularProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, 8)

        return NextResponse.json({
            newArrivals,
            bestSellers,
            featured
        })
    } catch (error) {
        console.error('Failed to fetch landing page data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch landing page data' },
            { status: 500 }
        )
    }
}