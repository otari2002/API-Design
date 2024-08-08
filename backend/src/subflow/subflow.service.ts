import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubFlowDto } from './dto/create-subflow.dto';
import { UpdateSubFlowDto } from './dto/update-subflow.dto';

@Injectable()
export class SubFlowService {
  constructor(private prisma: PrismaService) {}

  create(createSubFlowDto: CreateSubFlowDto) {
    return this.prisma.subFlow.create({ data: createSubFlowDto });
  }

  findAll() {
    return this.prisma.subFlow.findMany({
      include: {
        subOutputs: true,
        subInputs: true,
        backend: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.subFlow.findUnique({ where: { id } ,
      include: {
        subOutputs: true,
        subInputs: true,
    },
  });
  }

  update(id: number, updateSubFlowDto: UpdateSubFlowDto) {
    return this.prisma.subFlow.update({
      where: { id },
      data: updateSubFlowDto,
    });
  }

  remove(id: number) {
    return this.prisma.subFlow.delete({ where: { id } });
  }
}
