/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,month,year,userId]` on the table `Forecast` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Forecast_categoryId_month_year_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'clffswkup0000nuyi1ibw7ldf';

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'clffswkup0000nuyi1ibw7ldf';

-- AlterTable
ALTER TABLE "Forecast" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'clffswkup0000nuyi1ibw7ldf';

-- AlterTable
ALTER TABLE "SavingSpending" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'clffswkup0000nuyi1ibw7ldf';

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'clffswkup0000nuyi1ibw7ldf';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'clffswkup0000nuyi1ibw7ldf';

-- CreateIndex
CREATE UNIQUE INDEX "Forecast_categoryId_month_year_userId_key" ON "Forecast"("categoryId", "month", "year", "userId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSpending" ADD CONSTRAINT "SavingSpending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
