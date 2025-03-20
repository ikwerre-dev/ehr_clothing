/*
  Warnings:

  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "notes",
DROP COLUMN "paymentStatus",
DROP COLUMN "total",
DROP COLUMN "updatedAt",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_orderId_key" ON "ShippingAddress"("orderId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_addressId_idx" ON "Order"("addressId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
