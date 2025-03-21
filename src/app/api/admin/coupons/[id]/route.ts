import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;

        const coupon = await prisma.coupon.findUnique({
            where: { id }
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error fetching coupon:', error);
        return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
    }
}
export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        const data = await request.json();

        if (!data.code || !data.discount || !data.validFrom || !data.validUntil) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingCoupon = await prisma.coupon.findUnique({ where: { id } });

        if (!existingCoupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        if (data.code !== existingCoupon.code) {
            const codeExists = await prisma.coupon.findUnique({ where: { code: data.code } });

            if (codeExists) {
                return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
            }
        }

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: data.code,
                discount: data.discount,
                type: data.type,
                minPurchase: data.minPurchase || 0,
                maxUses: data.maxUses || 100,
                validFrom: new Date(data.validFrom),
                validUntil: new Date(data.validUntil),
                status: data.status || 'active'
            }
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}
export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;

        const existingCoupon = await prisma.coupon.findUnique({ where: { id } });

        if (!existingCoupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        await prisma.coupon.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}