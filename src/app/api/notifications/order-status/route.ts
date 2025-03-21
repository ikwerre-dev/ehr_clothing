import { NextResponse } from 'next/server'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const { email, status, orderId, reference, customerName } = await request.json()

        await sendOrderStatusUpdateEmail(email, {
            orderId,
            reference,
            status,
            customerName
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to send email:', error)
        return NextResponse.json(
            { error: 'Failed to send email notification' },
            { status: 500 }
        )
    }
}