import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.price || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.title,
        description: data.description,
        price: parseFloat(data.price),
        images: data.image ? [data.image] : [],
        categoryId: data.categoryId,
        stock: parseInt(data.stock) || 0
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: params.id },
        })

        return new Response(null, { status: 204 })
    } catch (error) {
        console.error('Product deletion error:', error)
        return Response.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}