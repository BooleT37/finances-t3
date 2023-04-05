-- CreateTable
CREATE TABLE "UserSetting" (
    "id" SERIAL NOT NULL,
    "pePerMonth" INTEGER NOT NULL DEFAULT 50,
    "savings" DOUBLE PRECISION,
    "savingsDate" DATE,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_userId_key" ON "UserSetting"("userId");

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
