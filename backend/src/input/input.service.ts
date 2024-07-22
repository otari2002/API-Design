import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInputDto } from './dto/create-input.dto';
import { UpdateInputDto } from './dto/update-input.dto';

@Injectable()
export class InputService {
  constructor(private prisma: PrismaService) {}

  create(createInputDto: CreateInputDto) {
    return this.prisma.input.create({ data: createInputDto });
  }

  findAll() {
    return this.prisma.input.findMany();
  }

  findOne(id: number) {
    return this.prisma.input.findUnique({ where: { id } });
  }

  update(id: number, updateInputDto: UpdateInputDto) {
    return this.prisma.input.update({
      where: { id },
      data: updateInputDto,
    });
  }

  remove(id: number) {
    return this.prisma.input.delete({ where: { id } });
  }
}
