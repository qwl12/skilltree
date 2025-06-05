/*
  Warnings:

  - You are about to drop the column `duration` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `finishedAt` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `passed` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `TestResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "duration",
DROP COLUMN "finishedAt",
DROP COLUMN "passed",
DROP COLUMN "startedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedIds" TEXT[],
    "inputAnswer" TEXT,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "TestResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
