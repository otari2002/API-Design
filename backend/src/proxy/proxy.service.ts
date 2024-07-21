import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';

@Injectable()
export class ProxyService {
  constructor(private prisma: PrismaService) {}

  create(createProxyDto: CreateProxyDto) {
    return this.prisma.proxy.create({ data: createProxyDto });
  }

  findAll() {
    return this.prisma.proxy.findMany();
  }

  findOne(id: number) {
    return this.prisma.proxy.findUnique({ where: { id } });
  }

  update(id: number, updateProxyDto: UpdateProxyDto) {
    return this.prisma.proxy.update({
      where: { id },
      data: updateProxyDto,
    });
  }

  remove(id: number) {
    return this.prisma.proxy.delete({ where: { id } });
  }
}
