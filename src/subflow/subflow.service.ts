import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubFlowService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.flow.findMany({
      include: {
        outputs: true,
        inputs: true,
        backend: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.flow.findUnique({ where: { id } ,
      include: {
        outputs: true,
        inputs: true,
    },
  });
  }
}
