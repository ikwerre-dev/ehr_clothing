/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[reference]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropIndex
DROP INDEX "Order_addressId_idx";

-- DropIndex
DROP INDEX "Order_userId_idx";

-- DropIndex
DROP INDEX "OrderItem_orderId_idx";

-- DropIndex
DROP INDEX "OrderItem_productId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "shipping" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "addressId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
