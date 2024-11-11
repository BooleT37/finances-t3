-- CreateEnum
CREATE TYPE "ExpensesParser" AS ENUM ('VIVID');

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "parser" "ExpensesParser";
