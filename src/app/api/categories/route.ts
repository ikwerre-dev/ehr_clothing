import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client/wasm'
 
interface CategoryWithProducts extends Category {
    products: Array<{
        id: string
        name: string
        images: string[]
    }>
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '3')

    try {
        const categories = await prisma.category.findMany({
            take: limit,
            include: {
                products: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    select: {
                        id: true,
                        name: true,
                        images: true
                    }
                }
            }
        })

        const formattedCategories = categories.map((category: CategoryWithProducts) => ({
            id: category.id,
            name: category.name,
            latestProduct: category.products[0] || null
        }))

        return NextResponse.json(formattedCategories)
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}