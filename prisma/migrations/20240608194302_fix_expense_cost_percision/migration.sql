/*
  Warnings:

  - You are about to alter the column `cost` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(9,2);
