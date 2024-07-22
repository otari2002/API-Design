import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubFlowUsageService } from './subflowusage.service';
import { CreateSubFlowUsageDto } from './dto/create-subflowusage.dto';
import { UpdateSubFlowUsageDto } from './dto/update-subflowusage.dto';

@Controller('subflowusage')
export class SubflowusageController {
  constructor(private readonly subflowusageService: SubFlowUsageService) {}

  @Post()
  create(@Body() createSubflowusageDto: CreateSubFlowUsageDto) {
    return this.subflowusageService.create(createSubflowusageDto);
  }

  @Get()
  findAll() {
    return this.subflowusageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subflowusageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubflowusageDto: UpdateSubFlowUsageDto) {
    return this.subflowusageService.update(+id, updateSubflowusageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subflowusageService.remove(+id);
  }
}
