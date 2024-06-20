/*
  Warnings:

  - You are about to alter the column `cost` on the `ExpenseComponent` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - You are about to alter the column `sum` on the `Forecast` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - You are about to alter the column `forecast` on the `SavingSpendingCategory` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - You are about to alter the column `cost` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - You are about to alter the column `savings` on the `UserSetting` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "ExpenseComponent" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "Forecast" ALTER COLUMN "sum" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "SavingSpendingCategory" ALTER COLUMN "forecast" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "UserSetting" ALTER COLUMN "savings" SET DATA TYPE DECIMAL(9,2);
