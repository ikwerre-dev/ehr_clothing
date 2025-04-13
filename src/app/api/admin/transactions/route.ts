import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/squad'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const [transactions, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    reference: true,
                    paymentMethod: true,
                    total: true,
                    paymentStatus: true,
                    paymentReference: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.order.count()
        ])

        return NextResponse.json({
            transactions,
            total,
            pages: Math.ceil(total / limit)
        })
    } catch (error) {
        console.error('Failed to fetch transactions:', error)
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
         const { reference } = await request.json()
        console.log(reference)
        const verificationResult = await verifyPayment(reference)
        return NextResponse.json(verificationResult)
    } catch (error) {
        console.error('Failed to verify transaction:', error)
        return NextResponse.json({ error: 'Failed to verify transaction' }, { status: 500 })
    }
}