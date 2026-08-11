-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "transactionId" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
