import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server' 

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json()
    
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    } 
    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code,
        status: 'active',
        validFrom: {
          lte: new Date()
        },
        validUntil: {
          gte: new Date()
        }
      }
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 })
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json({ 
        error: `Minimum purchase of ₦${coupon.minPurchase.toLocaleString()} required` 
      }, { status: 400 })
    }

    // Check if coupon has reached maximum uses
    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'Coupon has reached maximum usage limit' }, { status: 400 })
    }

    
    // Calculate discount amount
    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.discount) / 100
    } else {
      discountAmount = coupon.discount
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type,
        discountAmount
      }
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}