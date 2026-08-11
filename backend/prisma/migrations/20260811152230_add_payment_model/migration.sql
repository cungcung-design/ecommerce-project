-- Create payment method enum and payment table

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'ONLINE');

-- AlterTable: add payment method to existing orders (nullable for legacy rows)
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod";

-- CreateTable: Payment record related to Order
CREATE TABLE "Payment" (
    "id" SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" VARCHAR(191),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- Create Foreign Key
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Refresh the updated timestamp on payment changes
CREATE OR REPLACE FUNCTION "trigger_update_timestamp_payment"()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trigger_update_timestamp_payment"
BEFORE UPDATE ON "Payment"
FOR EACH ROW EXECUTE FUNCTION "trigger_update_timestamp_payment"();
