/*
  Warnings:

  - You are about to alter the column `pePerMonth` on the `UserSetting` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "UserSetting" ALTER COLUMN "pePerMonth" DROP NOT NULL,
ALTER COLUMN "pePerMonth" DROP DEFAULT,
ALTER COLUMN "pePerMonth" SET DATA TYPE DECIMAL(9,2);
