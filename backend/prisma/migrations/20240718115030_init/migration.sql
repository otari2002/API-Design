-- CreateEnum
CREATE TYPE "ApigeeInstance" AS ENUM ('X', 'HYBRID');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('HEADER', 'BODY', 'QUERY');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'OBJECT', 'ARRAY');

-- CreateEnum
CREATE TYPE "BackendType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateTable
CREATE TABLE "Proxy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Proxy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "subject" TEXT,
    "description" TEXT,
    "proxyId" INTEGER NOT NULL,
    "instanceApigee" "ApigeeInstance",
    "domain" TEXT,
    "verb" TEXT,
    "path" TEXT,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Input" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "source" "SourceType" NOT NULL,
    "type" "ValueType" NOT NULL,
    "validation" TEXT,
    "parentId" INTEGER,
    "flowId" INTEGER NOT NULL,

    CONSTRAINT "Input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Output" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "source" "SourceType" NOT NULL,
    "validation" TEXT,
    "flowId" INTEGER,

    CONSTRAINT "Output_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubFlow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "backendId" INTEGER NOT NULL,
    "backendPath" TEXT NOT NULL,
    "ssl" BOOLEAN NOT NULL,

    CONSTRAINT "SubFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubInput" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "source" "SourceType" NOT NULL,
    "type" "ValueType" NOT NULL,
    "subFlowId" INTEGER,

    CONSTRAINT "SubInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubOutput" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "source" "SourceType" NOT NULL,
    "type" "ValueType" NOT NULL,
    "subFlowId" INTEGER,
    "parentId" INTEGER,

    CONSTRAINT "SubOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubFlowUsage" (
    "id" SERIAL NOT NULL,
    "flowId" INTEGER NOT NULL,
    "isConditionnal" BOOLEAN NOT NULL,
    "condition" TEXT,
    "subFlowId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SubFlowUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backend" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "prodUrl" TEXT,
    "noProdUrl" TEXT,
    "type" "BackendType" NOT NULL,

    CONSTRAINT "Backend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestMapping" (
    "id" SERIAL NOT NULL,
    "apigee" TEXT,
    "backend" TEXT,
    "type" "SourceType" NOT NULL,
    "flowId" INTEGER,
    "subFlowId" INTEGER,

    CONSTRAINT "RequestMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flow_proxyId_verb_path_key" ON "Flow"("proxyId", "verb", "path");

-- CreateIndex
CREATE UNIQUE INDEX "SubFlowUsage_subFlowId_flowId_key" ON "SubFlowUsage"("subFlowId", "flowId");

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Input"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubFlow" ADD CONSTRAINT "SubFlow_backendId_fkey" FOREIGN KEY ("backendId") REFERENCES "Backend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubInput" ADD CONSTRAINT "SubInput_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOutput" ADD CONSTRAINT "SubOutput_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOutput" ADD CONSTRAINT "SubOutput_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubOutput"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubFlowUsage" ADD CONSTRAINT "SubFlowUsage_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubFlowUsage" ADD CONSTRAINT "SubFlowUsage_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_subFlowId_fkey" FOREIGN KEY ("subFlowId") REFERENCES "SubFlow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
