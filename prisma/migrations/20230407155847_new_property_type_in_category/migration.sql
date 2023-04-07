-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PERSONAL_EXPENSE', 'FROM_SAVINGS', 'TO_SAVINGS', 'RENT');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "CategoryType";
