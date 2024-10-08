import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFlowDto, InputDto, OutputDto } from "./dto/create-flow.dto";
import {
  UpdateFlowDto,
  UpdateInputDto,
  UpdateOutputDto,
} from "./dto/update-flow.dto";
import { SourceType } from "@prisma/client";
import {
  SubFlowDto,
  RequestMappingDto,
} from "./dto/create-subflow.dto";
import { Request, Response } from "express";

@Injectable()
export class FlowService {
  constructor(private prisma: PrismaService) {}

  async create(createFlowDto: CreateFlowDto, req: Request, res: Response) {
    console.log("createFlowDto", createFlowDto);

    const { infoflow, inputs, outputs, subflows, subOutputs } = createFlowDto;
    const {
      proxyId,
      name,
      subject,
      description,
      instanceApigee,
      domain,
      verb,
      backendId,
      path,
      ssl
    } = infoflow;
    const proxyExists = await this.prisma.proxy.findUnique({
      where: { id: proxyId },
    });
    console.log("proxyId", proxyId);
    if (!proxyExists) {
      return res.json({
        status: "error",
        message: "The provided proxyId does not exist.",
      });
    }
    
    const isApigeeFlow = instanceApigee === "X" || instanceApigee === "HYBRID";
    if(isApigeeFlow){
      const existingApigeeFlow = await this.prisma.flow.findFirst({
        where: {
          domain: domain,
          path: path,
        },
      });
      if (existingApigeeFlow) {
        return res.json({
          status: "error",
          message: "A flow with the same domain and path already exists.",
        });
      }
    }else{
      console.log(Number(backendId), path, name);
      const existingElementaryFlow = await this.prisma.flow.findFirst({
        where: {
          backendId: Number(backendId),
          path: path,
        },
      });
  
      if (existingElementaryFlow) {
        return res.json({
          status: "error",
          message: "A flow with the same backend and path already exists.",
        });
      }
    }

    const existingFlowWithSameName = await this.prisma.flow.findFirst({
      where: {
        name: name,
      },
    });
    if (existingFlowWithSameName) {
      return res.json({
        status: "error",
        message: "A flow with the same name already exists.",
      });
    }

    const newFlow = await this.prisma.flow.create({
      data: {
        proxyId,
        name,
        subject,
        description,
        instanceApigee,
        domain: isApigeeFlow ? domain : null,
        verb,
        path,
        backendId: isApigeeFlow ? null : Number(backendId),
        ssl: isApigeeFlow ? null : ssl,
      },
    });

    const subflowsToMap = isApigeeFlow ?  subflows : []; 

    await Promise.all([
      ...inputs["BODY"].map((input) => this.createInput(input, newFlow.id)),
      ...inputs["HEADER"].map((input) => this.createInput(input, newFlow.id)),
      ...inputs["QUERY"].map((input) => this.createInput(input, newFlow.id)),
      subflowsToMap.map((subflow, subflowIndex) =>
        this.createMapping(newFlow.id, subflow, subflowIndex)
      ),
      ...outputs["BODY"].map((output) => this.createOutput(output, newFlow.id)),
      ...outputs["HEADER"].map((output) =>
        this.createOutput(output, newFlow.id)
      ),
      ...subOutputs["BODY"].map((subOutput) =>
        this.createOutput(subOutput, newFlow.id)
      ),
      ...subOutputs["HEADER"].map(async (subOutput) => {
        const newSubOutput = await this.createOutput(subOutput, newFlow.id);
        if (Array.isArray(subOutput.children)) {
          await Promise.all(
            subOutput.children.map((child: OutputDto) =>
              this.updateOutput(child, newFlow.id, newSubOutput.id)
            )
          );
        }
      }
      ),
    ]);

    return res.status(200).json({
      status: "success",
      message: "Flow created successfully.",
      flow: newFlow
    });
  }

  // async createInput(input: InputDto, flowId: number, parentId: number | null = null) {
  //   const createdInput = await this.prisma.input.create({
  //     data: {
  //       name: input.name,
  //       type: input.type,
  //       validation: input.validation,
  //       source: input.source,
  //       flowId,
  //       parentId,
  //     },
  //   });

  //   await Promise.all(input.children.map((child: InputDto) => this.createInput(child, flowId, createdInput.id)));
  //   return createdInput;
  // }
  async createInput(
    input: InputDto,
    flowId: number,
    parentId: number | null = null
  ) {
    const createdInput = await this.prisma.input.create({
      data: {
        name: input.name,
        type: input.type,
        validation: input.validation,
        source: input.source,
        flowId,
        parentId,
      },
    });

    if (input.children.length > 0) {
      await Promise.all(
        input.children.map((child: InputDto) =>
          this.createInput(child, flowId, createdInput.id)
        )
      );
    }

    return createdInput;
  }

  async createOutput(
    output: OutputDto,
    flowId: number,
    parentId: number | null = null
  ) {
    const createdOutput = await this.prisma.output.create({
      data: {
        name: output.name,
        mapping: output.mapping,
        source: output.source,
        origin: output.origin,
        subOutputSource: output.subOutputSource,
        flowId,
        parentId,
        type: output.type,
      },
    });
    return createdOutput;
  }

  async createMapping(
    flowId: number,
    subflow: SubFlowDto,
    subflowIndex: number
  ) {
    const existingMapping = await this.prisma.subFlowUsage.findUnique({
      where: {
        subFlowId_flowId: {
          subFlowId: subflow.id,
          flowId: flowId,
        },
      },
    });

    if (existingMapping) {
      console.log("existingMapping", existingMapping);
    } else {
      console.log("new Mapping created");

      console.log("subflow.isConditional", subflow.isConditional);
      
      await this.prisma.subFlowUsage.create({
        data: {
          // isConditional: false,
          isConditional: subflow.isConditional,
          condition: subflow.condition,
          order: subflowIndex,
          flow: { connect: { id: flowId } },
          subFlow: { connect: { id: subflow.id } },
        },
      });
    }

    ["BODY", "HEADER", "QUERY"].forEach(async (value: SourceType) => {
      await Promise.all(
        subflow.requestMappings[value].map(
          async (mapping: RequestMappingDto) => {
            if (mapping.apigee === "") return;
            var subInputId = mapping.inputId;
            const parent = subflow.requestMappings[value].find(
              (rm: RequestMappingDto) => rm.inputId == mapping.parentId
            );
            if (parent && parent.apigee !== "") return;
            await this.prisma.requestMapping.create({
              data: {
                apigee: mapping.apigee,
                source: value,
                origin: mapping.origin,
                subOutputSource: mapping.subOutputSource,
                subInput: { connect: { id: subInputId } },
                flow: { connect: { id: flowId } },
                subFlowId: subflow.id,
              },
            });
          }
        )
      );
    });
  }
  async updateMapping(flowId: number, subflow: SubFlowDto) {
    ["BODY", "HEADER", "QUERY"].forEach(async (value: SourceType) => {
      await Promise.all(
        subflow.requestMappings[value].map(
          async (mapping: RequestMappingDto) => {
            if (mapping.apigee === "") return;
            var subInputId = mapping.inputId;
            const parent = subflow.requestMappings[value].find(
              (rm: RequestMappingDto) => rm.inputId == mapping.parentId
            );
            if (parent && parent.apigee !== "") return;
            await this.prisma.requestMapping.create({
              data: {
                apigee: mapping.apigee,
                source: value,
                origin: mapping.origin,
                subOutputSource: mapping.subOutputSource,
                subInput: { connect: { id: subInputId } },
                flow: { connect: { id: flowId } },
                subFlowId: subflow.id,
              },
            });
          }
        )
      );
    });
  }

  findAll() {
    return this.prisma.flow.findMany({ include: { backend: true, proxy: true } });
  }

  findOne(id: number) {
    return this.prisma.flow.findUnique({ where: { id } });
  }

  async findDetailedFlow(flowId: number) {
    const loadedFlow = await this.prisma.flow.findFirst({
      where: {
        id: flowId,
      },
      include: {
        inputs: true,
        outputs: true,
        subFlowUsages: {
          include: {
            subFlow: {
              include: {
                inputs: true,
                outputs: true,
                backend: true,
              },
            },
          },
        },
      },
    });
    const requestMappingsList = await this.prisma.requestMapping.findMany({
      where: {
        flowId: flowId,
      },
    });
    return { ...loadedFlow, requestMappingsList };
  }

  async findByProxyId(proxyId: number, subject: string) {
    if(subject){
      return this.prisma.flow.findMany({ where: { proxyId, subject }, include: { backend: true } });
    }else{
      return this.prisma.flow.findMany({ where: { proxyId }, include: { backend: true } });
    }
  }

  remove(id: number) {
    return this.prisma.flow.delete({ where: { id } });
  }

  async update(
    id: number,
    updateFlowDto: UpdateFlowDto,
    req: Request,
    res: Response
  ) {
    const { infoflow, inputs, outputs, subOutputs, subflows } = updateFlowDto;

    const existingApigeeFlow = await this.prisma.flow.findFirst({
      where: {
        id: { not: id },
        domain: infoflow.domain,
        path: infoflow.path,
      },
    });

    if (existingApigeeFlow) {
      return res.json({
        status: "error",
        message: "A flow with the same domain and path already exists.",
      });
    }

    const existingElementaryFlow = await this.prisma.flow.findFirst({
      where: {
        id: { not: id },
        backendId: Number(infoflow.backendId),
        path: infoflow.path,
      },
    });

    if (existingElementaryFlow) {
      return res.json({
        status: "error",
        message: "A flow with the same backend and path already exists.",
      });
    }

    const existingFlowWithSameName = await this.prisma.flow.findFirst({
      where: {
        id: { not: id },
        name: infoflow.name,
      },
    });

    if (existingFlowWithSameName) {
      return res.json({
        status: "error",
        message: "A flow with the same name already exists.",
      });
    }

    if (infoflow) {
      const isApigeeFlow = infoflow.instanceApigee === "X" || infoflow.instanceApigee === "HYBRID";
      await this.prisma.flow.update({
        where: { id },
        data: {
          name: infoflow.name,
          subject: infoflow.subject,
          description: infoflow.description,
          instanceApigee: infoflow.instanceApigee,
          domain: isApigeeFlow ? infoflow.domain : null,
          verb: infoflow.verb,
          path: infoflow.path,
          backendId: isApigeeFlow ? null : Number(infoflow.backendId),
          ssl: isApigeeFlow ? null : infoflow.ssl,
        },
      });
    }
    if (inputs) {
      var allParentInputs = await this.prisma.input.findMany({
        where: { flowId: id, parentId: null },
      });
      var newInputsIds = [
        ...inputs["BODY"],
        ...inputs["HEADER"],
        ...inputs["QUERY"],
      ].map((input) => input.inputId);
      allParentInputs = allParentInputs.filter(
        (input) => !newInputsIds.includes(input.id)
      );

      await Promise.all(
        allParentInputs.map((input) =>
          this.prisma.input.delete({ where: { id: input.id } })
        )
      );
      if (Array.isArray(inputs["BODY"])) {
        await Promise.all(
          inputs["BODY"].map((input) => this.updateInput(input, id))
        );
      }
      if (Array.isArray(inputs["HEADER"])) {
        await Promise.all(
          inputs["HEADER"].map((input) => this.updateInput(input, id))
        );
      }
      if (Array.isArray(inputs["QUERY"])) {
        await Promise.all(
          inputs["QUERY"].map((input) => this.updateInput(input, id))
        );
      }
    }
    if (outputs) {
      var allParentOutputs = await this.prisma.output.findMany({
        where: { flowId: id, parentId: null },
      });
      var newOutputsIds = [...outputs["BODY"], ...outputs["HEADER"]].map(
        (output) => output.outputId
      );
      allParentOutputs = allParentOutputs.filter(
        (output) => !newOutputsIds.includes(output.id)
      );

      await Promise.all(
        allParentOutputs.map((output) =>
          this.prisma.output.delete({ where: { id: output.id } })
        )
      );

      await Promise.all(
        outputs["BODY"].map((output) => this.updateOutput(output, id))
      );
      await Promise.all(
        outputs["HEADER"].map((output) => this.updateOutput(output, id))
      );
    }
    if (subOutputs) {
      var allParentSubOutputs = await this.prisma.output.findMany({
        where: { flowId: id, parentId: null },
      });
      var newSubOutPutsIds = [
        ...subOutputs["BODY"],
        ...subOutputs["HEADER"],
      ].map((subOutput) => subOutput.outputId);
      allParentSubOutputs = allParentSubOutputs.filter(
        (subOutput) => !newSubOutPutsIds.includes(subOutput.id)
      );

      await Promise.all(
        subOutputs["BODY"].map((subOutput) => this.updateOutput(subOutput, id))
      );
      await Promise.all(
        subOutputs["HEADER"].map((subOutput) =>
          this.updateOutput(subOutput, id)
        )
      );
    }
    // const subflowIds = subflows.map((x) => x.id);
    // const existingSubFlowUsages = await this.prisma.subFlowUsage.findMany({
    //   where: {
    //     flowId: id,
    //   },
    // });

    // // Delete subFlowUsages that are not present in the incoming request
    // await Promise.all(
    //   existingSubFlowUsages.map(async (usage) => {
    //     if (!subflowIds.includes(usage.subFlowId)) {
          
    //     }
    //   })
    // );
    await this.prisma.subFlowUsage.deleteMany({
      where: {
        flowId: id,
      },
    });

    if (subflows.length > 0) {
      subflows.map(async (subflow,subflowIndex) => {
        await this.prisma.requestMapping.deleteMany({
          where: {
            flowId: id,
            subFlowId: subflow.id,
          },
        });
        await this.createMapping(id, subflow, subflowIndex);
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Flow updated successfully.",
    });
  }

  async updateInput(
    input: UpdateInputDto,
    flowId: number,
    parentId: number | null = null
  ) {
    if (input.inputId) {
      const updatedInput = await this.prisma.input.update({
        where: { id: input.inputId },
        data: {
          name: input.name,
          type: input.type,
          validation: input.validation,
          source: input.source,
          flowId: flowId,
          parentId,
        },
      });

      if (input.children.length > 0) {
        await Promise.all(
          input.children.map((child: UpdateInputDto) =>
            this.updateInput(child, flowId, updatedInput.id)
          )
        );
      }
    } else {
      await this.createInput(input, flowId, parentId);
    }
  }
  async updateOutput(
    output: UpdateOutputDto,
    flowId: number,
    parentId: number | null = null
  ) {
    if (output.outputId) {
      const updatedOutput = await this.prisma.output.update({
        where: { id: output.outputId },
        data: {
          name: output.name,
          type: output.type,
          source: output.source,
          flowId: flowId,
          parentId,
        },
      });

      if (Array.isArray(output.children)) {
        await Promise.all(
          output.children.map((child: UpdateOutputDto) =>
            this.updateOutput(child, flowId, updatedOutput.id)
          )
        );
      }
    } else {
      await this.createOutput(output, flowId, parentId);
    }
  }
}
