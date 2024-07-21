import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

@Injectable()
export class FlowService {
  constructor(private prisma: PrismaService) {}

  create(createFlowDto: CreateFlowDto) {
    return this.prisma.flow.create({ data: createFlowDto });
  }

  findAll() {
    return this.prisma.flow.findMany();
  }

  findOne(id: number) {
    return this.prisma.flow.findUnique({ where: { id } });
  }

  update(id: number, updateFlowDto: UpdateFlowDto) {
    return this.prisma.flow.update({
      where: { id },
      data: updateFlowDto,
    });
  }

  remove(id: number) {
    return this.prisma.flow.delete({ where: { id } });
  }
}
