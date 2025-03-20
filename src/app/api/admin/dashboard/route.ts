import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      recentOrders,
      popularProducts
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID'
        },
        _sum: {
          total: true
        }
      }),
      prisma.order.count(),
      prisma.user.count({
        where: {
          role: 'USER'
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: {
              orderItems: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalCustomers,
      recentOrders,
      popularProducts
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}