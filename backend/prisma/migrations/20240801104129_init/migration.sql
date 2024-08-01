-- DropForeignKey
ALTER TABLE "SubFlowUsage" DROP CONSTRAINT "SubFlowUsage_subFlowId_fkey";

-- AddForeignKey
ALTER TABLE "SubFlowUsage" ADD CONSTRAINT "SubFlowUsage_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
