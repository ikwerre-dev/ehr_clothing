import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminPaymentNotification, sendPaymentConfirmationEmail } from '@/lib/email';

// interface OrderItem {
//     id: string;
//     title: string;
//     size: string;
//     color: string;
//     quantity: number;
//     price: number;
// }
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const reference = searchParams.get('reference')

        if (!reference) {
            return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
        }

        // Verify with Squad
        const response = await fetch(`https://sandbox-api-d.squadco.com/transaction/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${process.env.SQUAD_SECRET_KEY}`,
            }
        })

        const data = await response.json()

        if (data.success == true) {
            // Update order status
            await prisma.order.update({
                where: { reference },
                data: {
                    status: 'PROCESSING',
                    paymentStatus: 'PAID'
                }
            })

            // Get order details with customer info
            const order = await prisma.order.findUnique({
                where: { reference },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            console.log(order)

            if (!order) {
                throw new Error('Order not found')
            }


            // In the GET function, update the items mapping:
            await Promise.all([
                // Customer email
                sendPaymentConfirmationEmail(order.email, {
                    reference: order.reference,
                    customerName: order.customerName,
                    amount: order.total,
                    phone: order.phone,
                    items: order.items.map((item) => ({
                        id: item.id,
                        title: item.product.name,
                        name: item.product.name,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }),

                // Admin email
                sendAdminPaymentNotification({
                    to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'investorhonour@gmail.com',
                    reference: order.reference,
                    customerName: order.customerName,
                    customerEmail: order.email,
                    amount: order.total,
                    items: order.items.map((item) => ({
                        id: item.id,
                        title: item.product.name,
                        name: item.product.name,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            ])

            return NextResponse.json({ status: 'success', data })
        }

        // Handle failed payment
        await prisma.order.update({
            where: { reference },
            data: {
                status: 'PENDING',
                paymentStatus: 'PENDING'
            }
        })

        return NextResponse.json({ status: 'failed', data })
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        )
    }
}