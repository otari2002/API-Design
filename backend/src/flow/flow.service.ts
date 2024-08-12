import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto, InputDto, OutputDto } from './dto/create-flow.dto';
import { UpdateFlowDto, UpdateInputDto, UpdateOutputDto } from './dto/update-flow.dto';
import { SourceType } from '@prisma/client';
import { SubFlowDto, RequestMappingDto, SubOutputDto } from './dto/create-subflow.dto';
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
      ...subflows.map((subflow, subflowIndex) => this.createMapping(newFlow.id, subflow, subflowIndex)),
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

  async createMapping(flowId: number, subflow: SubFlowDto, subflowIndex: number) {
    await this.prisma.subFlowUsage.create({
      data: {
        isConditional: subflow.isConditional,
        condition: subflow.condition,
        order: subflowIndex,
        flow: { connect: { id: flowId } },
        subFlow: { connect: { id: subflow.id } },
      },
    });
    ['BODY', 'HEADER', 'QUERY'].forEach(async (value : SourceType) => {
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
            subFlowId: subflow.id,
          },
        });
      })); 
    });
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
    return {...loadedFlow, requestMappingsList};
  }

  async findByProxyId(proxyId: number) {
    return this.prisma.flow.findMany({ where: { proxyId } });
  }

  remove(id: number) {
    return this.prisma.flow.delete({ where: { id } });
  }

  // async update(id: number, updateFlowDto: UpdateFlowDto) {
  //   const { infoflow, inputs, outputs, subflows} = updateFlowDto;
  //   // if(infoflow){
  //   //   await this.prisma.flow.update({
  //   //     where: { id },
  //   //     data: {
  //   //       name: infoflow.name,
  //   //       subject: infoflow.subject,
  //   //       description: infoflow.description,
  //   //       instanceApigee: infoflow.instanceApigee,
  //   //       domain: infoflow.domain,
  //   //       verb: infoflow.verb,
  //   //     }
  //   //   });
  //   // }
  //   if(inputs){
  //     var allParentInputs = await this.prisma.input.findMany({ where: { flowId: id, parentId: null } });
  //     var newInputsIds = [...inputs['BODY'],...inputs['HEADER'], ...inputs['QUERY']].map(input => input.inputId);
  //     allParentInputs = allParentInputs.filter(input => !newInputsIds.includes(input.id));
      
  //     await Promise.all(allParentInputs.map(input => this.prisma.input.delete({ where: { id: input.id } })));
  //     await Promise.all(inputs['BODY'].map(input => this.updateInput(input, id)));
  //     await Promise.all(inputs['HEADER'].map(input => this.updateInput(input, id)));
  //     await Promise.all(inputs['QUERY'].map(input => this.updateInput(input, id)));
  //   }
  //   // if(outputs){
  //   //   await Promise.all(outputs['BODY'].map(output => this.updateOutput(output, id)));
  //   //   await Promise.all(outputs['HEADER'].map(output => this.updateOutput(output, id)));
  //   // }
  // }

  // async updateInput(input: UpdateInputDto, flowId: number, parentId: number | null = null) {
  //   if(input.inputId){
  //     const updatedInput = await this.prisma.input.update({
  //       where: { id: input.inputId },
  //       data: {
  //         name: input.name,
  //         type: input.type,
  //         validation: input.validation,
  //         source: input.source,
  //         flowId,
  //         parentId,
  //       },
  //     });
  //     await Promise.all(input.children.map((child: UpdateInputDto) => this.updateInput(child, flowId, updatedInput.id)));
  //   }else{
  //     await this.createInput(input, flowId, parentId);
  //   }
  // }

  // async updateOutput(output: UpdateOutputDto, flowId: number) {
  //   if(output.outputId){
  //     await this.prisma.output.update({
  //       where: { id: output.outputId },
  //       data: {
  //         name: output.name,
  //         mapping: output.mapping,
  //         source: output.source,
  //         origin: output.origin,
  //         subOutputSource: output.subOutputSource,
  //         flowId,
  //       },
  //     });
  //   }else{
  //     await this.createOutput(output, flowId);
  //   }
  // }
}
