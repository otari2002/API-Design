import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestMappingDto } from './dto/create-requestmapping.dto';
import { UpdateRequestMappingDto } from './dto/update-requestmapping.dto';

@Injectable()
export class RequestMappingService {
  constructor(private prisma: PrismaService) {}

  create(createRequestMappingDto: CreateRequestMappingDto) {
    return this.prisma.requestMapping.create({ data: createRequestMappingDto });
  }

  findAll() {
    return this.prisma.requestMapping.findMany();
  }

  findOne(id: number) {
    return this.prisma.requestMapping.findUnique({ where: { id } });
  }

  update(id: number, updateRequestMappingDto: UpdateRequestMappingDto) {
    return this.prisma.requestMapping.update({
      where: { id },
      data: updateRequestMappingDto,
    });
  }

  remove(id: number) {
    return this.prisma.requestMapping.delete({ where: { id } });
  }
}
