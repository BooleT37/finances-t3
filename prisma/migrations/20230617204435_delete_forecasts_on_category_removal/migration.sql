-- DropForeignKey
ALTER TABLE "Forecast" DROP CONSTRAINT "Forecast_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
