import { NextResponse } from 'next/server'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, subject, message } = body

         // Send notification to admin
       const mailoutput =  await sendContactNotification({
            to: process.env.PUBLIC_ADMIN_EMAIL || 'investorhonour@gmail.com',
            name,
            email,
            subject,
            message
        })

        console.log(mailoutput)
        // Send confirmation to user
        await sendContactConfirmation({
            to: email,
            name
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Failed to process contact form' },
            { status: 500 }
        )
    }
}