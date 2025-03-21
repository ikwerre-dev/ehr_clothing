import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
export async function GET() {
    try {

        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(coupons)
    } catch (error) {
        console.error('Error fetching coupons:', error)
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
    }
}

// CREATE a new coupon
export async function POST(request: Request) {
    try {

        const data = await request.json()

        // Validate required fields
        if (!data.code || !data.discount || !data.validFrom || !data.validUntil) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if coupon code already exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: {
                code: data.code
            }
        })

        if (existingCoupon) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
        }

        // Create the coupon
        const coupon = await prisma.coupon.create({
            data: {
                code: data.code,
                discount: data.discount,
                type: data.type,
                minPurchase: data.minPurchase || 0,
                maxUses: data.maxUses || 100,
                validFrom: new Date(data.validFrom),
                validUntil: new Date(data.validUntil),
                status: data.status || 'active'
            }
        })

        return NextResponse.json(coupon)
    } catch (error) {
        console.error('Error creating coupon:', error)
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
    }
}