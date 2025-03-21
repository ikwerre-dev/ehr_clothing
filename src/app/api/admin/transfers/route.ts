// import { NextResponse } from 'next/server'
// import { initiateTransfer, getTransferHistory } from '@/lib/squad'

// export async function GET() {
//     try {
//         const data = await getTransferHistory()
//         return NextResponse.json(data)
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 })
//     }
// }

// export async function POST(request: Request) {
//     try {
//         const { amount, remark } = await request.json()
//         const data = await initiateTransfer(amount, remark)
//         console.log(data)
//         return NextResponse.json(data)
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to initiate transfer' }, { status: 500 })
//     }
// }