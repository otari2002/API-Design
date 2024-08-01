/*
  Warnings:

  - The `subOutputSource` column on the `Output` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `type` on the `RequestMapping` table. All the data in the column will be lost.
  - Added the required column `origin` to the `RequestMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `RequestMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Output" DROP COLUMN "subOutputSource",
ADD COLUMN     "subOutputSource" "SourceType";

-- AlterTable
ALTER TABLE "RequestMapping" DROP COLUMN "type",
ADD COLUMN     "origin" TEXT NOT NULL,
ADD COLUMN     "source" "SourceType" NOT NULL,
ADD COLUMN     "subOutputSource" "SourceType";
