/*
  Warnings:

  - You are about to drop the column `personalExpenseId` on the `Expense` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_personalExpenseId_fkey";

-- DropIndex
DROP INDEX "Expense_personalExpenseId_key";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "personalExpenseId";
