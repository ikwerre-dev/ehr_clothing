import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
 
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'ehr@veefa.co',
    pass: 'Trailer1234#'
  }
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
        
        const transporter = nodemailer.createTransport(SMTP_CONFIG)

        const [users, products, categories, orders, coupons, addresses, orderItems] = await Promise.all([
            prisma.$queryRaw`SELECT * FROM "User"`,
            prisma.$queryRaw`SELECT * FROM "Product"`,
            prisma.$queryRaw`SELECT * FROM "Category"`,
            prisma.$queryRaw`SELECT * FROM "Order"`,
            prisma.$queryRaw`SELECT * FROM "Coupon"`,
            prisma.$queryRaw`SELECT * FROM "Address"`,
            prisma.$queryRaw`SELECT * FROM "OrderItem"`
        ])

        let sqlDump = `-- EHR Database Backup ${timestamp}\n\n`
        
        sqlDump += `CREATE DATABASE IF NOT EXISTS ehr;\n\n`
        sqlDump += `USE ehr;\n\n`

        sqlDump += `CREATE TABLE IF NOT EXISTS "User" (
            id VARCHAR(255) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            phone VARCHAR(255),
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'USER',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );\n\n`

        users.forEach((user: any) => {
            sqlDump += `INSERT INTO "User" (id, email, name, phone, password, role, createdAt, updatedAt) VALUES (
                '${user.id}',
                '${user.email}',
                ${user.name ? `'${user.name}'` : 'NULL'},
                ${user.phone ? `'${user.phone}'` : 'NULL'},
                '${user.password}',
                '${user.role}',
                '${user.createdAt.toISOString()}',
                '${user.updatedAt.toISOString()}'
            );\n`
        })

        await transporter.sendMail({
            from: SMTP_CONFIG.auth.user,
            to: 'codewithhonour@gmail.com',
            subject: 'email backup for ehr',
            text: `Database Statistics:
                Users: ${counts[0].users_count}
                Products: ${counts[0].products_count}
                Categories: ${counts[0].categories_count}
                Orders: ${counts[0].orders_count}
                Total Revenue: ${revenue[0].total_revenue}
                Active Users: ${activeUsers[0].active_users}
                Active Coupons: ${activeCoupons[0].active_coupons}`,
            attachments: [{
                filename: `backup-${timestamp}.sql`,
                content: sqlDump
            }]
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
                recipient: 'codewithhonour@gmail.com'
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