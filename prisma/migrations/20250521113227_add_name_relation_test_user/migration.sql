/*
  Warnings:

  - A unique constraint covering the columns `[testId,userId]` on the table `TestResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TestResult_userId_testId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TestResult_testId_userId_key" ON "TestResult"("testId", "userId");
