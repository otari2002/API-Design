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
  SubOutputDto,
} from "./dto/create-subflow.dto";
import { Request, Response } from "express";

@Injectable()
export class FlowService {
  constructor(private prisma: PrismaService) {}

  async create(createFlowDto: CreateFlowDto, req: Request, res: Response) {
    const { infoflow, inputs, outputs, subflows } = createFlowDto;
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
    } = infoflow;

    const existingFlow = await this.prisma.flow.findFirst({
      where: {
        domain,
        path,
        name,
      },
    });

    if (existingFlow) {
      return res.status(400).json({
        message: "A flow with the same domain, path, and name already exists.",
      });
    }

    const newFlow = await this.prisma.flow.create({
      data: {
        proxyId,
        name,
        subject,
        description,
        instanceApigee,
        domain,
        verb,
        path,
        backendId: Number(backendId),
      },
    });

    await Promise.all([
      ...inputs["BODY"].map((input) => this.createInput(input, newFlow.id)),
      ...inputs["HEADER"].map((input) => this.createInput(input, newFlow.id)),
      ...inputs["QUERY"].map((input) => this.createInput(input, newFlow.id)),
      ...subflows.map((subflow, subflowIndex) =>
        this.createMapping(newFlow.id, subflow, subflowIndex)
      ),
      ...outputs["BODY"].map((output) => this.createOutput(output, newFlow.id)),
      ...outputs["HEADER"].map((output) =>
        this.createOutput(output, newFlow.id)
      ),
    ]);

    return res.status(200).json(newFlow);
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
      // Update the existing entry
      await this.prisma.subFlowUsage.update({
        where: {
          subFlowId_flowId: {
            subFlowId: subflow.id,
            flowId: flowId,
          },
        },
        data: {
          isConditional: false,
          // isConditional: subflow.isConditional,
          condition: subflow.condition,
          order: subflowIndex,
        },
      });
    } else {
      await this.prisma.subFlowUsage.create({
        data: {
          isConditional: false,
          // isConditional: subflow.isConditional,
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

  findAll() {
    return this.prisma.flow.findMany({ include: { backend: true } });
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

  async findByProxyId(proxyId: number) {
    return this.prisma.flow.findMany({ where: { proxyId } });
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

    const existingFlow = await this.prisma.flow.findFirst({
      where: {
        id: { not: id },
        domain: infoflow.domain,
        path: infoflow.path,
        name: infoflow.name,
      },
    });

    if (existingFlow) {
      return res.status(400).json({
        message: "A flow with the same domain, path, and name already exists.",
      });
    }

    if (infoflow) {
      await this.prisma.flow.update({
        where: { id },
        data: {
          name: infoflow.name,
          subject: infoflow.subject,
          description: infoflow.description,
          instanceApigee: infoflow.instanceApigee,
          domain: infoflow.domain,
          verb: infoflow.verb,
          backendId: Number(infoflow.backendId),
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
      await Promise.all(
        subOutputs["BODY"].map((subOutput) => this.updateOutput(subOutput, id))
      );
      await Promise.all(
        subOutputs["HEADER"].map((subOutput) =>
          this.updateOutput(subOutput, id)
        )
      );
    }
    if (subflows) {
      subflows.map((subflow, subflowIndex) =>
        this.createMapping(id, subflow, subflowIndex)
      );
    }

    return res.status(201).json({
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
          // parentId: output.parentId,
        },
      });

      if (output.children.length>0 ) {
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
