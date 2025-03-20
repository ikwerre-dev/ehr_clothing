/*
  Warnings:

  - You are about to drop the column `orderNumber` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_orderNumber_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderNumber",
ADD COLUMN     "reference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");
