/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `TestResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,testId]` on the table `TestResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passed` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "finishedAt",
DROP COLUMN "startedAt",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "passed" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TestResult_userId_testId_key" ON "TestResult"("userId", "testId");
