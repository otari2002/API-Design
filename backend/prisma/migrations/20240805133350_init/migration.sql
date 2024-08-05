-- AlterTable
ALTER TABLE "SubFlow" ADD COLUMN     "viaFlow" INTEGER;

-- AddForeignKey
ALTER TABLE "SubFlow" ADD CONSTRAINT "SubFlow_viaFlow_fkey" FOREIGN KEY ("viaFlow") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
