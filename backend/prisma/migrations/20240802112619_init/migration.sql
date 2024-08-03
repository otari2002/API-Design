-- AlterTable
ALTER TABLE "SubInput" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "SubInput" ADD CONSTRAINT "SubInput_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;
