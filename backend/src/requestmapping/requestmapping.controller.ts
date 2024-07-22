import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestMappingService } from './requestmapping.service';
import { CreateRequestMappingDto } from './dto/create-requestmapping.dto';
import { UpdateRequestMappingDto } from './dto/update-requestmapping.dto';

@Controller('requestmapping')
export class RequestmappingController {
  constructor(private readonly requestmappingService: RequestMappingService) {}

  @Post()
  create(@Body() createRequestmappingDto: CreateRequestMappingDto) {
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
  update(@Param('id') id: string, @Body() updateRequestmappingDto: UpdateRequestMappingDto) {
    return this.requestmappingService.update(+id, updateRequestmappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestmappingService.remove(+id);
  }
}
