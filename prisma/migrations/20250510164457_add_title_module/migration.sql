/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Subcategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_name_key" ON "Subcategory"("name");
