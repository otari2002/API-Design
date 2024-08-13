import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBackendDto } from './dto/create-backend.dto';
import { UpdateBackendDto } from './dto/update-backend.dto';

@Injectable()
export class BackendService {
  constructor(private prisma: PrismaService) {}

  create(createBackendDto: CreateBackendDto) {
    return this.prisma.backend.create({ data: createBackendDto});
  }

  findAll() {
    return this.prisma.backend.findMany();
  }

  findOne(id: number) {
    return this.prisma.backend.findUnique({ where: { id } });
  }

  update(id: number, updateBackendDto: UpdateBackendDto) {
    return this.prisma.backend.update({
      where: { id },
      data: updateBackendDto,
    });
  }

  remove(id: number) {
    return this.prisma.backend.delete({ where: { id } });
  }
}
