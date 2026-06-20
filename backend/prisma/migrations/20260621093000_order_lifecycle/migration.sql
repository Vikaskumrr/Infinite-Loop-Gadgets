-- AlterEnum
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

CREATE TYPE "OrderStatus" AS ENUM (
    'PAYMENT_PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

ALTER TABLE "Order"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING (
    CASE "status"::text
      WHEN 'PENDING' THEN 'PAYMENT_PENDING'::"OrderStatus"
      WHEN 'PLACED' THEN 'CONFIRMED'::"OrderStatus"
      ELSE "status"::text::"OrderStatus"
    END
  ),
  ALTER COLUMN "status" SET DEFAULT 'PAYMENT_PENDING';

DROP TYPE "OrderStatus_old";
