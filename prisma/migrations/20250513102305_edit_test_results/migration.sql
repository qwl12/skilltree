/*
  Warnings:

  - Added the required column `finishedAt` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "finishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
