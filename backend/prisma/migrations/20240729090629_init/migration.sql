/*
  Warnings:

  - You are about to drop the column `backend` on the `RequestMapping` table. All the data in the column will be lost.
  - You are about to drop the column `validation` on the `SubOutput` table. All the data in the column will be lost.
  - Added the required column `origin` to the `Output` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Output" ADD COLUMN     "mapping" TEXT,
ADD COLUMN     "origin" TEXT NOT NULL,
ADD COLUMN     "subOutputSource" TEXT;

-- AlterTable
ALTER TABLE "RequestMapping" DROP COLUMN "backend",
ADD COLUMN     "subInputId" INTEGER;

-- AlterTable
ALTER TABLE "SubOutput" DROP COLUMN "validation";

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_subInputId_fkey" FOREIGN KEY ("subInputId") REFERENCES "SubInput"("id") ON DELETE SET NULL ON UPDATE CASCADE;
