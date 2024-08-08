import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto, InputDto, OutputDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { SourceType, SubOutput } from '@prisma/client';
import { CreateSubFlowDto, RequestMappingDto, SubOutputDto } from './dto/create-subflow.dto';
@Injectable()
export class FlowService {
  constructor(private prisma: PrismaService) {}

  async create(createFlowDto: CreateFlowDto) {
    const {
      infoflow,
      inputs, 
      outputs, 
      subflows 
    } = createFlowDto;
    const {
      proxyId, 
      name, 
      subject, 
      description, 
      instanceApigee, 
      domain, 
      verb, 
      path, 
    } = infoflow;
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

  async createInput(input: InputDto, flowId: number, parentId: number | null = null) {
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

    await Promise.all(input.children.map((child: InputDto) => this.createInput(child, flowId, createdInput.id)));
    return createdInput;
  }

  async createOutput(output: OutputDto, flowId: number) {
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

  async createSubFlow(flowId: number, subflow: CreateSubFlowDto, index: number) {
    var subflowId = subflow.id;
    var subflowCondition = null;

    if (!subflow.isLoaded) {
      const newSubFlow = await this.prisma.subFlow.create({
        data: {
          name: subflow.name,
          backendId: subflow.backendId,
          backendPath: subflow.backendPath,
          ssl: subflow.ssl,
          viaFlow: flowId,
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
      if(subflow.isLoaded){
        await Promise.all(subflow.requestMappings[value].map(async (mapping: RequestMappingDto) => {
          if(mapping.apigee === '') return;
          var subInputId = mapping.inputId;
          const parent = subflow.requestMappings[value].find((rm: RequestMappingDto) => rm.inputId == mapping.parentId);
          if(parent && parent.apigee !== '') return;
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
      }else{
        await Promise.all(subflow.requestMappings[value].filter((rm: RequestMappingDto) => !rm.parentId)
        .map(async (mapping: RequestMappingDto) => {
          if(mapping.apigee === '') return;
          const newSubInput = await this.prisma.subInput.create({
            data: {
              name: mapping.backend ? mapping.backend : mapping.apigee,
              type: mapping.type,
              source: value,
              subFlow: { connect: { id: subflowId } },
            },
          });
          if(!mapping.isEmpty){
            await this.prisma.requestMapping.create({
              data: {
                apigee: mapping.apigee,
                source: value,
                origin: mapping.origin,
                subOutputSource: mapping.subOutputSource, 
                subInput: { connect: { id: newSubInput.id } },
                flow: { connect: { id: flowId } },
                subFlow: { connect: { id: subflowId } },
              },
            });
          }else{
            const children = subflow.requestMappings[value].filter((child: any) => child.parentId == mapping.inputId);
            children.forEach(async (child: RequestMappingDto) => { 
              if(child.apigee === '') return;
              const childInput = await this.prisma.subInput.create({
                data: {
                  name: child.backend ? child.backend : child.apigee,
                  type: child.type,
                  source: value,
                  parent: { connect: { id: newSubInput.id } },
                  subFlow: { connect: { id: subflowId } },
                },
              });
              await this.prisma.requestMapping.create({
                data: {
                  apigee: child.apigee,
                  source: value,
                  origin: child.origin,
                  subOutputSource: child.subOutputSource, 
                  subInput: { connect: { id: childInput.id } },
                  flow: { connect: { id: flowId } },
                  subFlow: { connect: { id: subflowId } },
                },
              });
            });
          }
        })); 
      } 
    });
    
    if (!subflow.isLoaded) {
      ['BODY', 'HEADER'].forEach(async (value : SourceType) => {
        await Promise.all(subflow.subOutputs[value].filter((output: SubOutputDto) => output.parentId == null).map(async (output: SubOutputDto) => {
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
                          subInputs: true,
                          subOutputs: true
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
    return {...loadedFlow, requestMappingsList};
  }

  async getFlowWithInputs(flowId: number) {
    const flow = await this.prisma.flow.findUnique({
      where: { id: flowId },
      include: {
        inputs: {
          include: {
            children: true,
          },
        },
        outputs: true,
        subFlowUsages: {
          include: { subFlow: { include: { requestMappings: true } } },
        },
      },
    });
    return flow;
  }

  async findByProxyId(proxyId: number) {
    return this.prisma.flow.findMany({ where: { proxyId } });
  }

  async update(id: number, updateFlowDto: UpdateFlowDto) {
    const { infoflow, inputs, outputs, subflows} = updateFlowDto;
    if(infoflow){
      await this.prisma.flow.update({
        where: { id },
        data: {
          name: infoflow.name,
          subject: infoflow.subject,
          description: infoflow.description,
          instanceApigee: infoflow.instanceApigee,
          domain: infoflow.domain,
          verb: infoflow.verb,
        }
      });
    }
    if(inputs){
      await Promise.all(inputs['BODY'].map(input => this.updateInput(input, id)));
      await Promise.all(inputs['HEADER'].map(input => this.updateInput(input, id)));
      await Promise.all(inputs['QUERY'].map(input => this.updateInput(input, id)));
    }
    if(outputs){
      await Promise.all(outputs['BODY'].map(output => this.updateOutput(output, id)));
      await Promise.all(outputs['HEADER'].map(output => this.updateOutput(output, id)));
    }
  }

  remove(id: number) {
    return this.prisma.flow.delete({ where: { id } });
  }

  async updateInput(input: InputDto, flowId: number, parentId: number | null = null) {
    if(input.inputId){
      const updatedInput = await this.prisma.input.update({
        where: { id: input.inputId },
        data: {
          name: input.name,
          type: input.type,
          validation: input.validation,
          source: input.source,
          flowId,
          parentId,
        },
      });
      await Promise.all(input.children.map((child: InputDto) => this.createInput(child, flowId, updatedInput.id)));
    }else{
      await this.createInput(input, flowId, parentId);
    }
  }

  async updateOutput(output: OutputDto, flowId: number) {
    if(output.outputId){
      await this.prisma.output.update({
        where: { id: output.outputId },
        data: {
          name: output.name,
          mapping: output.mapping,
          source: output.source,
          origin: output.origin,
          subOutputSource: output.subOutputSource,
          flowId,
        },
      });
    }else{
      await this.createOutput(output, flowId);
    }
  }
}
