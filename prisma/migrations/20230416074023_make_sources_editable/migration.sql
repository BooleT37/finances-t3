-- AlterTable
ALTER TABLE "UserSetting" ADD COLUMN     "sourcesOrder" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
