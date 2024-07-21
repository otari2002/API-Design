import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestmappingService } from './requestmapping.service';
import { CreateRequestmappingDto } from './dto/create-requestmapping.dto';
import { UpdateRequestmappingDto } from './dto/update-requestmapping.dto';

@Controller('requestmapping')
export class RequestmappingController {
  constructor(private readonly requestmappingService: RequestmappingService) {}

  @Post()
  create(@Body() createRequestmappingDto: CreateRequestmappingDto) {
    return this.requestmappingService.create(createRequestmappingDto);
  }

  @Get()
  findAll() {
    return this.requestmappingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestmappingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestmappingDto: UpdateRequestmappingDto) {
    return this.requestmappingService.update(+id, updateRequestmappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestmappingService.remove(+id);
  }
}
