import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubflowusageService } from './subflowusage.service';
import { CreateSubflowusageDto } from './dto/create-subflowusage.dto';
import { UpdateSubflowusageDto } from './dto/update-subflowusage.dto';

@Controller('subflowusage')
export class SubflowusageController {
  constructor(private readonly subflowusageService: SubflowusageService) {}

  @Post()
  create(@Body() createSubflowusageDto: CreateSubflowusageDto) {
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
  update(@Param('id') id: string, @Body() updateSubflowusageDto: UpdateSubflowusageDto) {
    return this.subflowusageService.update(+id, updateSubflowusageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subflowusageService.remove(+id);
  }
}
