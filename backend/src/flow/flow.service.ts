import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { SourceType, SubOutput } from '@prisma/client';
@Injectable()
export class FlowService {
  constructor(private prisma: PrismaService) {}

  async create(createFlowDto: CreateFlowDto) {
    const {
      proxyId, 
      name, 
      subject, 
      description, 
      instanceApigee, 
      domain, 
      verb, 
      path, 
      inputs, 
      outputs, 
      subflows 
    } = createFlowDto;

    const newFlow = await this.prisma.flow.create({
      data: {
        proxyId,
        name,
        subject,
        description,
        instanceApigee,
        domain,
        verb,
        path
      },
    });

    await Promise.all([
      ...inputs['BODY'].map(input => this.createInput(input, newFlow.id)),
      ...inputs['HEADER'].map(input => this.createInput(input, newFlow.id)),
      ...inputs['QUERY'].map(input => this.createInput(input, newFlow.id)),
      ...subflows.map((subflow, index) => this.createSubFlow(newFlow.id, subflow, index)),
      ...outputs['BODY'].map(output => this.createOutput(output, newFlow.id)),
      ...outputs['HEADER'].map(output => this.createOutput(output, newFlow.id)),
    ]);

    return newFlow;
  }

  async createInput(input: any, flowId: number, parentId: number | null = null) {
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

    await Promise.all(input.children.map((child: any) => this.createInput(child, flowId, createdInput.id)));
    return createdInput;
  }

  async createOutput(output: any, flowId: number) {
    const createdOutput = await this.prisma.output.create({
      data: {
        name: output.name,
        
        mapping: output.mapping,
        source: output.source,
        origin: output.origin,
        subOutputSource: output.subOutputSource,
        flowId,
      },
    });
    return createdOutput;
  }

  async createSubFlow(flowId: number, subflow: any, index: number) {
    let subflowId = subflow.id;
    let subflowCondition = null;

    if (!subflow.isLoaded) {
      const newSubFlow = await this.prisma.subFlow.create({
        data: {
          name: subflow.name,
          backendId: subflow.backendId,
          backendPath: subflow.backendPath,
          ssl: subflow.ssl,
        },
      });
      subflowId = newSubFlow.id;
    }

    if (subflow.isConditional) {
      subflowCondition = subflow.condition;
    }

    await this.prisma.subFlowUsage.create({
      data: {
        isConditional: subflow.isConditional ?? false,
        condition: subflowCondition,
        order: index,
        flow: { connect: { id: flowId } },
        subFlow: { connect: { id: subflowId } },
      },
    });
    ['BODY', 'HEADER', 'QUERY'].forEach(async (value : SourceType) => {
      await Promise.all(subflow.requestMappings[value].map(async (mapping: any) => {
        let subInputId = mapping.inputId;
        if (!subflow.isLoaded) {
          const newSubInput = await this.prisma.subInput.create({
            data: {
              name: mapping.backend ? mapping.backend : mapping.apigee,
              type: mapping.type,
              source: value,
              subFlow: { connect: { id: subflowId } },
            },
          });
          subInputId = newSubInput.id;
        };
        await this.prisma.requestMapping.create({
          data: {
            apigee: mapping.apigee,
            source: value,
            origin: mapping.origin,
            subOutputSource: mapping.subOutputSource, 
            subInput: { connect: { id: subInputId } },
            flow: { connect: { id: flowId } },
            subFlow: { connect: { id: subflowId } },
          },
        });
      }));  
    });
    
    if (!subflow.isLoaded) {
      ['BODY', 'HEADER'].forEach(async (value : SourceType) => {
        await Promise.all(subflow.subOutputs[value].filter((output: any) => output.parentId == null).map(async (output: any) => {
          const newSubOutput = await this.prisma.subOutput.create({
            data: {
              name: output.name,
              source: output.source,
              type: output.type,
              subFlow: { connect: { id: subflowId } },
            },
          });
  
          const children = subflow.subOutputs[value].filter((child: any) => child.parentId == output.id);
          await Promise.all(children.map(async (child: SubOutput) => {
            await this.prisma.subOutput.create({
              data: {
                name: child.name,
                source: child.source,
                type: child.type,
                parent: { connect: { id: newSubOutput.id } },
                subFlow: { connect: { id: subflowId } },
              },
            });
          }));
        }));
      });
      
    }
  }
 
  findAll() {
    return this.prisma.flow.findMany();
  }

  findOne(id: number) {
    return this.prisma.flow.findUnique({ where: { id } });
  }

  async findByProxyId(proxyId: number) {
    return this.prisma.flow.findMany({ where: { proxyId } });
  }

  update(id: number, updateFlowDto: UpdateFlowDto) {
    const { inputs, outputs, subflows, ...updateData } = updateFlowDto;
    return this.prisma.flow.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: number) {
    return this.prisma.flow.delete({ where: { id } });
  }
}