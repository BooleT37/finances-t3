/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,month,year]` on the table `Forecast` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Forecast" ALTER COLUMN "sum" SET DEFAULT 0,
ALTER COLUMN "comment" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Forecast_categoryId_month_year_key" ON "Forecast"("categoryId", "month", "year");
