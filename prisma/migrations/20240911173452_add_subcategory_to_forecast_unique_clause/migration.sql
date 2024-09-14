/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,subcategoryId,month,year,userId]` on the table `Forecast` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Forecast_categoryId_month_year_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Forecast_categoryId_subcategoryId_month_year_userId_key" ON "Forecast"("categoryId", "subcategoryId", "month", "year", "userId");
