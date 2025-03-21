import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json()
        const category = await prisma.category.update({
            where: { id: params.id },
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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // First, check if category has any products
        console.log('started')
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                products: true
            }
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

        await prisma.category.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)

        console.error('Delete category error:', error)
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}