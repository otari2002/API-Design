import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSubFlowUsageDto } from './dto/create-subflowusage.dto';
import { UpdateSubFlowUsageDto } from './dto/update-subflowusage.dto';

@Injectable()
export class SubFlowUsageService {
  constructor(private prisma: PrismaService) {}

  create(createSubFlowUsageDto: CreateSubFlowUsageDto) {
    return this.prisma.subFlowUsage.create({ data: createSubFlowUsageDto });
  }

  findAll() {
    return this.prisma.subFlowUsage.findMany();
  }

  findOne(id: number) {
    return this.prisma.subFlowUsage.findUnique({ where: { id } });
  }

  update(id: number, updateSubFlowUsageDto: UpdateSubFlowUsageDto) {
    return this.prisma.subFlowUsage.update({
      where: { id },
      data: updateSubFlowUsageDto,
    });
  }

  remove(id: number) {
    return this.prisma.subFlowUsage.delete({ where: { id } });
  }
}
