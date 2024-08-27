import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import { FlowService } from 'src/flow/flow.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService,
  private readonly flowService: FlowService
  ) {}

  @Post()
  create(@Body() createProxyDto: CreateProxyDto) {
    return this.proxyService.create(createProxyDto);
  }

  @Get()
  findAll() {
    return this.proxyService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('subject') subject: string = null
  ) {
    const flows = await this.flowService.findByProxyId(+id, subject);
    const proxy = await this.proxyService.findOne(+id);
    return { proxy, flows };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProxyDto: UpdateProxyDto) {
    return this.proxyService.update(+id, updateProxyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proxyService.remove(+id);
  }
}
