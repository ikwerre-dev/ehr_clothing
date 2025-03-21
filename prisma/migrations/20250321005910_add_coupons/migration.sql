/*
  Warnings:

  - You are about to drop the column `endDate` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxDiscount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `minAmount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Coupon` table. All the data in the column will be lost.
  - The `type` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `validFrom` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validUntil` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "endDate",
DROP COLUMN "isActive",
DROP COLUMN "maxDiscount",
DROP COLUMN "minAmount",
DROP COLUMN "startDate",
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "minPurchase" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "validFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'percentage';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "couponId" TEXT;

-- CreateTable
CREATE TABLE "CouponUsage" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CouponUsage_couponId_userId_orderId_key" ON "CouponUsage"("couponId", "userId", "orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
