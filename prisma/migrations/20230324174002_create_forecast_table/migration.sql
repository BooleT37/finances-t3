-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "SavingSpendingCategory" DROP CONSTRAINT "SavingSpendingCategory_savingSpendingId_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Forecast" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "month" SMALLINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "sum" SMALLINT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Forecast_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingSpendingCategory" ADD CONSTRAINT "SavingSpendingCategory_savingSpendingId_fkey" FOREIGN KEY ("savingSpendingId") REFERENCES "SavingSpending"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
