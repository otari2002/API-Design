const { PrismaClient } =require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create backends
    const backend1 = await prisma.backend.create({
      data: {
        name: "Backend 1",
        prodUrl: "https://prod.backend1.com",
        noProdUrl: "https://noprod.backend1.com",
        type: "INTERNAL",
      },
    });

    const backend2 = await prisma.backend.create({
      data: {
        name: "Backend 2",
        prodUrl: "https://prod.backend2.com",
        noProdUrl: "https://noprod.backend2.com",
        type: "EXTERNAL",
      },
    });

    // Create proxies
    const proxy1 = await prisma.proxy.create({
      data: {
        name: "Proxy 1",
        description: "Description for Proxy 1",
      },
    });

    const proxy2 = await prisma.proxy.create({
      data: {
        name: "Proxy 2",
        description: "Description for Proxy 2",
      },
    });

    // // Create flows for Proxy 1
    // const flow1 = await prisma.flow.create({
    //   data: {
    //     name: "Flow 1 for Proxy 1",
    //     subject: "Subject 1",
    //     description: "Description for Flow 1 of Proxy 1",
    //     proxyId: proxy1.id,
    //     instanceApigee: "X",
    //     domain: "domain1.com",
    //     verb: "POST",
    //     path: "/path1",
    //   },
    // });

    // const flow2 = await prisma.flow.create({
    //   data: {
    //     name: "Flow 2 for Proxy 1",
    //     subject: "Subject 2",
    //     description: "Description for Flow 2 of Proxy 1",
    //     proxyId: proxy1.id,
    //     instanceApigee: "HYBRID",
    //     domain: "domain2.com",
    //     verb: "GET",
    //     path: "/path2",
    //   },
    // });

    // Create subflows
    const subflow1 = await prisma.subFlow.create({
      data: {
        name: "SubFlow 1",
        backendId: backend1.id,
        backendPath: "/subflow-path1",
        ssl: true,
      },
    });

    const subflow2 = await prisma.subFlow.create({
      data: {
        name: "SubFlow 2",
        backendId: backend2.id,
        backendPath: "/subflow-path2",
        ssl: false
      },
    });

    const subOutput1 = await prisma.subOutput.create({
      data:{
        name: "SubOutput 1",
        source: "BODY",
        type: "OBJECT",
        subFlowId: subflow1.id
      }
    })
    const subOutput2 = await prisma.subOutput.create({
      data:{
        name: "SubChild",
        source: "BODY",
        type: "STRING",
        parentId: subOutput1.id,
        subFlowId: subflow1.id
      }
    })
    const subOutput3 = await prisma.subOutput.create({
      data:{
        name: "SubOutput 2",
        source: "BODY",
        type: "NUMBER",
        subFlowId: subflow1.id
      }
    })

    const subInput1 = await prisma.subInput.create({
      data:{
        name: "subChild",
        source: "BODY",
        type: "OBJECT",
        subFlow: { connect: { id: subflow1.id } },
      }
    })

    const subInput3 = await prisma.subInput.create({
      data:{
        name: "input 3",
        source: "BODY",
        type: "STRING",
        subFlow: { connect: { id: subflow1.id } },
      }
    })

    const subInput2 = await prisma.subInput.create({
      data:{
        name: "input 2",
        source: "HEADER",
        type: "OBJECT",
        subFlow: { connect: { id: subflow1.id } },
      }
    })

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
