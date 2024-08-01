/*
  Warnings:

  - Made the column `subFlowId` on table `SubInput` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SubInput" DROP CONSTRAINT "SubInput_subFlowId_fkey";

-- AlterTable
ALTER TABLE "SubInput" ALTER COLUMN "subFlowId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SubOutput" ADD COLUMN     "validation" TEXT;

-- AddForeignKey
ALTER TABLE "SubInput" ADD CONSTRAINT "SubInput_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
