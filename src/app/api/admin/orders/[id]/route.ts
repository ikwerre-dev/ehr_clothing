import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { status } = await request.json()

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status: status.toUpperCase() }
        })

        return NextResponse.json(updatedOrder)
    } catch (error) {
        console.error('Failed to update order:', error)
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}