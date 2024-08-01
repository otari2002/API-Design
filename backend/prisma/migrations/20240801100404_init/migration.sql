-- DropForeignKey
ALTER TABLE "Input" DROP CONSTRAINT "Input_flowId_fkey";

-- DropForeignKey
ALTER TABLE "Input" DROP CONSTRAINT "Input_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Output" DROP CONSTRAINT "Output_flowId_fkey";

-- DropForeignKey
ALTER TABLE "RequestMapping" DROP CONSTRAINT "RequestMapping_flowId_fkey";

-- DropForeignKey
ALTER TABLE "RequestMapping" DROP CONSTRAINT "RequestMapping_subInputId_fkey";

-- DropForeignKey
ALTER TABLE "SubInput" DROP CONSTRAINT "SubInput_subFlowId_fkey";

-- DropForeignKey
ALTER TABLE "SubOutput" DROP CONSTRAINT "SubOutput_parentId_fkey";

-- DropForeignKey
ALTER TABLE "SubOutput" DROP CONSTRAINT "SubOutput_subFlowId_fkey";

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Input"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_subInputId_fkey" FOREIGN KEY ("subInputId") REFERENCES "SubInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubInput" ADD CONSTRAINT "SubInput_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOutput" ADD CONSTRAINT "SubOutput_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOutput" ADD CONSTRAINT "SubOutput_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubOutput"("id") ON DELETE CASCADE ON UPDATE CASCADE;
