import { PrismaClient } from '@prisma/client'

const sourcePrisma = new PrismaClient({
  datasources: {
    db: {
      url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYTZjNjE1OTgtM2U4Zi00ZDRhLWIwZTEtNmY0MThmNDlkNzA3IiwidGVuYW50X2lkIjoiOTMwMzI2MTA2NWFiYjJhNzBlNTcxYjFhZjM0OTY0NDVhMDNmNjdjMzM0YjdmODE5MGU5MmM5NzIyNjQxN2ViMiIsImludGVybmFsX3NlY3JldCI6IjBhMmU2ZDEyLTAwY2QtNDZiNy04Yjg5LTE5Y2U5ZjllOGZkNiJ9.bTpaLKeGxxGrarO5ft2yAUojNtVgpWGr8TO5ETz5-fY"
    }
  }
})

const targetPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://myuser:Trailer1234%23@51.38.71.164:5432/ehr?schema=public",
    }
  }
})

async function migrateData() {
  try {
    await targetPrisma.$connect()
    await sourcePrisma.$connect()

    const categories = await sourcePrisma.category.findMany()
    for (const category of categories) {
      await targetPrisma.category.upsert({
        where: { id: category.id },
        update: category,
        create: category
      })
    }
    console.log('Categories migrated successfully')

    const products = await sourcePrisma.product.findMany()
    for (const product of products) {
      await targetPrisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      })
    }
    console.log('Products migrated successfully')

    const users = await sourcePrisma.user.findMany()
    for (const user of users) {
      await targetPrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      })
    }
    console.log('Users migrated successfully')

    const addresses = await sourcePrisma.address.findMany()
    for (const address of addresses) {
      await targetPrisma.address.upsert({
        where: { id: address.id },
        update: address,
        create: address
      })
    }
    console.log('Addresses migrated successfully')

    const coupons = await sourcePrisma.coupon.findMany()
    for (const coupon of coupons) {
      await targetPrisma.coupon.upsert({
        where: { id: coupon.id },
        update: coupon,
        create: coupon
      })
    }
    console.log('Coupons migrated successfully')

    const orders = await sourcePrisma.order.findMany()
    for (const order of orders) {
      await targetPrisma.order.upsert({
        where: { id: order.id },
        update: order,
        create: order
      })
    }
    console.log('Orders migrated successfully')

    const orderItems = await sourcePrisma.orderItem.findMany()
    for (const item of orderItems) {
      await targetPrisma.orderItem.upsert({
        where: { id: item.id },
        update: item,
        create: item
      })
    }
    console.log('Order items migrated successfully')

    const shippingAddresses = await sourcePrisma.shippingAddress.findMany()
    for (const address of shippingAddresses) {
      await targetPrisma.shippingAddress.upsert({
        where: { id: address.id },
        update: address,
        create: address
      })
    }
    console.log('Shipping addresses migrated successfully')

    const couponUsages = await sourcePrisma.couponUsage.findMany()
    for (const usage of couponUsages) {
      await targetPrisma.couponUsage.upsert({
        where: { id: usage.id },
        update: usage,
        create: usage
      })
    }
    console.log('Coupon usages migrated successfully')

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await sourcePrisma.$disconnect()
    await targetPrisma.$disconnect()
  }
}

migrateData()