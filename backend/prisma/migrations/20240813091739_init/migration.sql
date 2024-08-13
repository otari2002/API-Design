-- DropForeignKey
ALTER TABLE "SubFlowUsage" DROP CONSTRAINT "SubFlowUsage_flowId_fkey";

-- AddForeignKey
ALTER TABLE "SubFlowUsage" ADD CONSTRAINT "SubFlowUsage_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
