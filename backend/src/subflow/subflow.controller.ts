import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubFlowService } from './subflow.service';
import { CreateSubFlowDto } from './dto/create-subflow.dto';
import { UpdateSubFlowDto } from './dto/update-subflow.dto';

@Controller('subflow')
export class SubflowController {
  constructor(private readonly subflowService: SubFlowService) {}

  @Post()
  create(@Body() createSubflowDto: CreateSubFlowDto) {
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
  update(@Param('id') id: string, @Body() updateSubflowDto: UpdateSubFlowDto) {
    return this.subflowService.update(+id, updateSubflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subflowService.remove(+id);
  }
}
