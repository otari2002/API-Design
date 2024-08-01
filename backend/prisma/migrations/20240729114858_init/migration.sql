/*
  Warnings:

  - You are about to drop the column `isConditionnal` on the `SubFlowUsage` table. All the data in the column will be lost.
  - Added the required column `isConditional` to the `SubFlowUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubFlowUsage" DROP COLUMN "isConditionnal",
ADD COLUMN     "isConditional" BOOLEAN NOT NULL;
