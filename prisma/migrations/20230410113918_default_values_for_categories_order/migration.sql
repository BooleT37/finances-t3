-- AlterTable
ALTER TABLE "UserSetting" ALTER COLUMN "expenseCategoriesOrder" SET DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "incomeCategoriesOrder" SET DEFAULT ARRAY[]::INTEGER[];
