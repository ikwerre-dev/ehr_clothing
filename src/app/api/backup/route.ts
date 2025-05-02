import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const TELEGRAM_CONFIG = {
    botToken: '7391285391:AAGWPrHjXsogYiF4nigSXHdSJXQWcAQHsB0',
    chatId: '-1002596441157'
}

export async function GET() {
    try {
        const [
            counts,
            revenue,
            activeUsers,
            activeCoupons,
            recentOrders,
            topProducts
        ] = await Promise.all([
            prisma.$queryRaw`
                SELECT 
                    CAST((SELECT COUNT(*) FROM "User") AS INTEGER) as users_count,
                    CAST((SELECT COUNT(*) FROM "Product") AS INTEGER) as products_count,
                    CAST((SELECT COUNT(*) FROM "Category") AS INTEGER) as categories_count,
                    CAST((SELECT COUNT(*) FROM "Order") AS INTEGER) as orders_count,
                    CAST((SELECT COUNT(*) FROM "Coupon") AS INTEGER) as coupons_count,
                    CAST((SELECT COUNT(*) FROM "Address") AS INTEGER) as addresses_count,
                    CAST((SELECT COUNT(*) FROM "OrderItem") AS INTEGER) as order_items_count
            `,
            prisma.$queryRaw`
                SELECT CAST(COALESCE(SUM(total), 0) AS FLOAT) as total_revenue 
                FROM "Order" 
                WHERE "paymentStatus" = 'PAID'
            `,
            prisma.$queryRaw`
                SELECT CAST(COUNT(DISTINCT "userId") AS INTEGER) as active_users 
                FROM "Order"
            `,
            prisma.$queryRaw`
                SELECT CAST(COUNT(*) AS INTEGER) as active_coupons 
                FROM "Coupon" 
                WHERE status = 'active' 
                AND "validUntil" >= NOW()
            `,
            prisma.$queryRaw`
                SELECT 
                    o.id,
                    o.reference,
                    o."paymentStatus",
                    CAST(o.total AS FLOAT) as total,
                    o."createdAt",
                    u.name as user_name,
                    u.email as user_email
                FROM "Order" o
                LEFT JOIN "User" u ON o."userId" = u.id
                ORDER BY o."createdAt" DESC
                LIMIT 5
            `,
            prisma.$queryRaw`
                SELECT 
                    oi."productId",
                    p.name as product_name,
                    CAST(SUM(oi.quantity) AS INTEGER) as total_quantity
                FROM "OrderItem" oi
                JOIN "Product" p ON oi."productId" = p.id
                GROUP BY oi."productId", p.name
                ORDER BY SUM(oi.quantity) DESC
                LIMIT 5
            `
        ])

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

        const allData = await Promise.all([
            prisma.$queryRaw`
                SELECT 
                    id, email, name, phone, role, 
                    CAST(EXTRACT(EPOCH FROM "createdAt") AS INTEGER) as created_at,
                    CAST(EXTRACT(EPOCH FROM "updatedAt") AS INTEGER) as updated_at
                FROM "User"
            `,
            prisma.$queryRaw`
                SELECT 
                    id, name, description, CAST(price AS FLOAT) as price, 
                    images, "categoryId", CAST(stock AS INTEGER) as stock,
                    CAST(EXTRACT(EPOCH FROM "createdAt") AS INTEGER) as created_at,
                    CAST(EXTRACT(EPOCH FROM "updatedAt") AS INTEGER) as updated_at
                FROM "Product"
            `,
            prisma.$queryRaw`SELECT * FROM "Category"`,
            prisma.$queryRaw`
                SELECT 
                    id, reference, "customerName", email, phone, address,
                    city, state, "paymentMethod", CAST(total AS FLOAT) as total,
                    CAST("totalAmount" AS FLOAT) as total_amount,
                    CAST(subtotal AS FLOAT) as subtotal,
                    CAST(shipping AS FLOAT) as shipping,
                    status, "userId", "addressId", "paymentStatus", "paymentReference",
                    CAST(EXTRACT(EPOCH FROM "createdAt") AS INTEGER) as created_at,
                    CAST(EXTRACT(EPOCH FROM "updatedAt") AS INTEGER) as updated_at
                FROM "Order"
            `,
            prisma.$queryRaw`SELECT * FROM "Coupon"`,
            prisma.$queryRaw`SELECT * FROM "Address"`,
            prisma.$queryRaw`
                SELECT 
                    id, "orderId", "productId", 
                    CAST(quantity AS INTEGER) as quantity,
                    CAST(price AS FLOAT) as price,
                    size, color,
                    CAST(EXTRACT(EPOCH FROM "createdAt") AS INTEGER) as created_at,
                    CAST(EXTRACT(EPOCH FROM "updatedAt") AS INTEGER) as updated_at
                FROM "OrderItem"
            `
        ])

        const backupContent = JSON.stringify({
            users: allData[0],
            products: allData[1],
            categories: allData[2],
            orders: allData[3],
            coupons: allData[4],
            addresses: allData[5],
            orderItems: allData[6]
        }, null, 2)



        const backupBlob = new Blob([backupContent], { type: 'application/json' })
        const backupFormData = new FormData()
        backupFormData.append('chat_id', TELEGRAM_CONFIG.chatId)
        backupFormData.append('document', backupBlob, `ehr-backup-${timestamp}.json`)
        backupFormData.append('caption', `EHR - Backup`);


        await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendDocument`, {
            method: 'POST',
            body: backupFormData
        })

        return NextResponse.json({
            counts: {
                users: Number(counts[0].users_count),
                products: Number(counts[0].products_count),
                categories: Number(counts[0].categories_count),
                orders: Number(counts[0].orders_count),
                coupons: Number(counts[0].coupons_count),
                addresses: Number(counts[0].addresses_count),
                orderItems: Number(counts[0].order_items_count)
            },
            stats: {
                totalRevenue: Number(revenue[0].total_revenue),
                activeUsers: Number(activeUsers[0].active_users),
                activeCoupons: Number(activeCoupons[0].active_coupons)
            },
            recentActivity: {
                lastOrders: recentOrders,
                topSellingProducts: topProducts
            },
            backup: {
                sent: true,
                timestamp: new Date().toISOString(),
                recipient: TELEGRAM_CONFIG.chatId
            }
        })
    } catch (error) {
        console.error('Operation failed:', error)
        return NextResponse.json(
            { error: 'Failed to complete operation' },
            { status: 500 }
        )
    }
}