-- AlterTable
ALTER TABLE "Forecast" ADD COLUMN     "subcategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "subcategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
