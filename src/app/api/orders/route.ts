import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminOrderNotification, sendOrderConfirmationEmail } from '@/lib/email'

function generateReference() {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `EHR-${randomStr}`
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { items, customerInfo, total, subtotal, shipping } = body

        // Find existing user or create new one
        let user = await prisma.user.findUnique({
            where: { email: customerInfo.email }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: customerInfo.email,
                    name: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    phone: customerInfo.phone,
                    password: '', // Empty password for now since it's a guest checkout
                    role: 'USER'
                }
            })
        }

        const order = await prisma.order.create({
            data: {
                reference: generateReference(), // Changed from reference to reference
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                state: customerInfo.state,
                paymentMethod: customerInfo.paymentMethod,
                total,
                subtotal,
                shipping,
                status: 'PENDING',
                user: {
                    connect: {
                        id: user.id
                    }
                },
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        color: item.color
                    }))
                }
            }
        })

        // Update email references
        await Promise.all([
            sendOrderConfirmationEmail(customerInfo.email, {
                reference: order.reference, 
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                items: items.map((item: any) => ({
                    ...item,
                    title: item.title || 'Product'
                })),
                total,
                subtotal,
                shipping
            }),

            // Admin notification email
            sendAdminOrderNotification({
                reference: order.reference,
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                state: customerInfo.state,
                items: items.map((item: any) => ({
                    ...item,
                    title: item.title || 'Product'
                })),
                total,
                subtotal,
                shipping
            })
        ])

        return NextResponse.json({ reference: order.reference })
    } catch (error) {
        console.error('Failed to create order:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}