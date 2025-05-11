/*
  Warnings:

  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Question_testId_questionText_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "options";
