/*
  Warnings:

  - The values [PERSONAL_EXPENSE] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
UPDATE public."Category" SET "type" = NULL WHERE "type" = 'PERSONAL_EXPENSE';
CREATE TYPE "CategoryType_new" AS ENUM ('FROM_SAVINGS', 'TO_SAVINGS', 'RENT');
ALTER TABLE "Category" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "CategoryType_old";
COMMIT;
