import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubflowService } from './subflow.service';
import { CreateSubflowDto } from './dto/create-subflow.dto';
import { UpdateSubflowDto } from './dto/update-subflow.dto';

@Controller('subflow')
export class SubflowController {
  constructor(private readonly subflowService: SubflowService) {}

  @Post()
  create(@Body() createSubflowDto: CreateSubflowDto) {
    return this.subflowService.create(createSubflowDto);
  }

  @Get()
  findAll() {
    return this.subflowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subflowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubflowDto: UpdateSubflowDto) {
    return this.subflowService.update(+id, updateSubflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subflowService.remove(+id);
  }
}
