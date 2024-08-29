-- DropForeignKey
ALTER TABLE "RequestMapping" DROP CONSTRAINT "RequestMapping_flowId_fkey";

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
