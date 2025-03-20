import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      include: {
        orders: true,
        addresses: true,
      },
    })
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}