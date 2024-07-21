import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOutputDto } from './dto/create-output.dto';
import { UpdateOutputDto } from './dto/update-output.dto';

@Injectable()
export class OutputService {
  constructor(private prisma: PrismaService) {}

  create(createOutputDto: CreateOutputDto) {
    return this.prisma.output.create({ data: createOutputDto });
  }

  findAll() {
    return this.prisma.output.findMany();
  }

  findOne(id: number) {
    return this.prisma.output.findUnique({ where: { id } });
  }

  update(id: number, updateOutputDto: UpdateOutputDto) {
    return this.prisma.output.update({
      where: { id },
      data: updateOutputDto,
    });
  }

  remove(id: number) {
    return this.prisma.output.delete({ where: { id } });
  }
}
