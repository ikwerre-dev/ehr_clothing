import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    try {
        const products = await prisma.product.findMany({
            where: {
                ...(category && { categoryId: category }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error('Failed to fetch products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}