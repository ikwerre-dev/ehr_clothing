import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteParams = {
    params: {
        id: string
    }
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing category ID' }, { status: 400 })
    }

    try {
        const data = await request.json()
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description
            }
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing category ID' }, { status: 400 })
    }

    try {
        console.log('started')
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true }
        })

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }

        if (category.products.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with existing products' },
                { status: 400 }
            )
        }

        await prisma.category.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete category error:', error)
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}