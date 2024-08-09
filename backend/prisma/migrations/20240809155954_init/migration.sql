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
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "description" TEXT,
    "proxyId" INTEGER,
    "instanceApigee" "ApigeeInstance",
    "domain" TEXT,
    "verb" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "backendId" INTEGER,
    "ssl" BOOLEAN,

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
    "type" "ValueType",
    "mapping" TEXT,
    "validation" TEXT,
    "origin" TEXT,
    "subOutputSource" "SourceType",
    "parentId" INTEGER,
    "flowId" INTEGER,

    CONSTRAINT "Output_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubFlowUsage" (
    "id" SERIAL NOT NULL,
    "flowId" INTEGER NOT NULL,
    "subflowId" INTEGER NOT NULL,
    "isConditional" BOOLEAN NOT NULL,
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
    "subInputId" INTEGER NOT NULL,
    "source" "SourceType" NOT NULL,
    "origin" TEXT NOT NULL,
    "subOutputSource" "SourceType",
    "flowId" INTEGER NOT NULL,
    "subFlowId" INTEGER NOT NULL,

    CONSTRAINT "RequestMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flow_proxyId_verb_path_key" ON "Flow"("proxyId", "verb", "path");

-- CreateIndex
CREATE UNIQUE INDEX "SubFlowUsage_subflowId_flowId_key" ON "SubFlowUsage"("subflowId", "flowId");

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_backendId_fkey" FOREIGN KEY ("backendId") REFERENCES "Backend"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Input"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Output"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubFlowUsage" ADD CONSTRAINT "SubFlowUsage_subflowId_fkey" FOREIGN KEY ("subflowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestMapping" ADD CONSTRAINT "RequestMapping_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
