import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
// GET a specific coupon
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check admin authorization

        const coupon = await prisma.coupon.findUnique({
            where: {
                id: params.id
            }
        })

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
        }

        return NextResponse.json(coupon)
    } catch (error) {
        console.error('Error fetching coupon:', error)
        return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 })
    }
}

// UPDATE a coupon
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
     
        const data = await request.json()

        // Validate required fields
        if (!data.code || !data.discount || !data.validFrom || !data.validUntil) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if coupon exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: {
                id: params.id
            }
        })

        if (!existingCoupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
        }

        // Check if updated code conflicts with another coupon
        if (data.code !== existingCoupon.code) {
            const codeExists = await prisma.coupon.findUnique({
                where: {
                    code: data.code
                }
            })

            if (codeExists) {
                return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
            }
        }

        // Update the coupon
        const coupon = await prisma.coupon.update({
            where: {
                id: params.id
            },
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
        console.error('Error updating coupon:', error)
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
    }
}

// DELETE a coupon
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
     
        // Check if coupon exists
        const existingCoupon = await prisma.coupon.findUnique({
            where: {
                id: params.id
            }
        })

        if (!existingCoupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
        }

        // Delete the coupon
        await prisma.coupon.delete({
            where: {
                id: params.id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting coupon:', error)
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
    }
}