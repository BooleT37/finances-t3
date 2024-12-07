/*
  Warnings:

  - The values [RENT] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
UPDATE public."Category" SET "type" = NULL WHERE "type" = 'RENT';
CREATE TYPE "CategoryType_new" AS ENUM ('FROM_SAVINGS', 'TO_SAVINGS');
ALTER TABLE "Category" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "CategoryType_old";
COMMIT;
