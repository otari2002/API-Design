import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubOutputDto } from './dto/create-suboutput.dto';
import { UpdateSubOutputDto } from './dto/update-suboutput.dto';

@Injectable()
export class SubOutputService {
  constructor(private prisma: PrismaService) {}

  create(createSubOutputDto: CreateSubOutputDto) {
    return this.prisma.subOutput.create({ data: createSubOutputDto });
  }

  findAll() {
    return this.prisma.subOutput.findMany();
  }

  findOne(id: number) {
    return this.prisma.subOutput.findUnique({ where: { id } });
  }

  update(id: number, updateSubOutputDto: UpdateSubOutputDto) {
    return this.prisma.subOutput.update({
      where: { id },
      data: updateSubOutputDto,
    });
  }

  remove(id: number) {
    return this.prisma.subOutput.delete({ where: { id } });
  }
}
