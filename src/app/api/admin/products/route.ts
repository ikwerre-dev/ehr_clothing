import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.price || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert price to number and validate
    const price = parseFloat(data.price)
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    // Convert stock to number and validate
    const stock = parseInt(data.stock || '0')
    if (isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: 'Invalid stock value' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name: data.title,
        description: data.description || '',
        price: price,
        images: data.image ? [data.image] : [],
        categoryId: data.categoryId,
        stock: stock
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}