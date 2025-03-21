import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const latestCoupon = await prisma.coupon.findFirst({
            where: {
                status: 'active',
                validUntil: {
                    gte: new Date()
                },
                usedCount: {
                    lt: prisma.coupon.fields.usageLimit
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                code: true,
                discount: true,
                type: true,
                validUntil: true,
                maxUses: true,
                usedCount: true
            }
        })

 
        if (!latestCoupon) {
            return NextResponse.json(null)
        }


        return NextResponse.json(latestCoupon)
    } catch (error) {
        console.error('Failed to fetch latest coupon:', error)
        return NextResponse.json(null)
    }
}