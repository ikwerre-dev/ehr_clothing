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
        const { items, customerInfo, total, subtotal, shipping, couponId, discount } = body

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
        // Uncomment and use the OrderItem interface
        interface OrderItem {
            id: string;
            quantity: number;
            price: number;
            size: string;
            color: string;
            title?: string;
        }
        
        interface OrderData {
            reference: string;
            customerName: string;
            email: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            paymentMethod: string;
            total: number;
            subtotal: number;
            shipping: number;
            status: 'PENDING';
            user: {
                connect: {
                    id: string;
                };
            };
            items: {
                create: Array<{
                    productId: string;
                    quantity: number;
                    price: number;
                    size: string;
                    color: string;
                }>;
            };
            coupon?: {
                connect: {
                    id: string;
                };
            };
        }
        
        // Update the type annotations
        const orderData: OrderData = {
            reference: generateReference(),
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
            // Update the items mapping in orderData
            items: {
                create: items.map((item: OrderItem) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color
                }))
            }
        }

        // If coupon is applied, connect it to the order
        if (couponId) {
            // Check if coupon exists and is valid
            const coupon = await prisma.coupon.findUnique({
                where: { id: couponId }
            })

            if (coupon && coupon.status === 'active') {
                // Add coupon to order
                orderData.coupon = {
                    connect: { id: couponId }
                }
            }
        }

        // Create the order
        const order = await prisma.order.create({
            data: orderData
        })

        // If coupon was applied, record usage and increment count
        if (couponId) {
            // Increment coupon usage count
            await prisma.coupon.update({
                where: { id: couponId },
                data: { usedCount: { increment: 1 } }
            })

            // Record coupon usage for this user
            await prisma.couponUsage.create({
                data: {
                    coupon: { connect: { id: couponId } },
                    user: { connect: { id: user.id } },
                    order: { connect: { id: order.id } }
                }
            })
        }

        // Get coupon details for email if applied
        let couponDetails = null
        if (couponId) {
            const coupon = await prisma.coupon.findUnique({
                where: { id: couponId }
            })
            if (coupon) {
                couponDetails = {
                    code: coupon.code,
                    discount: discount
                }
            }
        }

        // Update email references
        await Promise.all([
            sendOrderConfirmationEmail(customerInfo.email, {
                reference: order.reference, 
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                items: items.map((item: OrderItem) => ({
                    ...item,
                    title: item.title || 'Product'
                })),
                total,
                subtotal,
                shipping,
                discount: discount || 0,
                coupon: couponDetails
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
                items: items.map((item: OrderItem) => ({
                    ...item,
                    title: item.title || 'Product'
                })),
                total,
                subtotal,
                shipping,
                discount: discount || 0,
                coupon: couponDetails
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