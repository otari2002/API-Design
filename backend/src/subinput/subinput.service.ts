import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubInputDto } from './dto/create-subinput.dto';
import { UpdateSubInputDto } from './dto/update-subinput.dto';

@Injectable()
export class SubInputService {
  constructor(private prisma: PrismaService) {}

  create(createSubInputDto: CreateSubInputDto) {
    return this.prisma.subInput.create({ data: createSubInputDto });
  }

  findAll() {
    return this.prisma.subInput.findMany();
  }

  findOne(id: number) {
    return this.prisma.subInput.findUnique({ where: { id } });
  }

  update(id: number, updateSubInputDto: UpdateSubInputDto) {
    return this.prisma.subInput.update({
      where: { id },
      data: updateSubInputDto,
    });
  }

  remove(id: number) {
    return this.prisma.subInput.delete({ where: { id } });
  }
}
