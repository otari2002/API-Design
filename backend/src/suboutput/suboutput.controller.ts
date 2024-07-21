import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuboutputService } from './suboutput.service';
import { CreateSuboutputDto } from './dto/create-suboutput.dto';
import { UpdateSuboutputDto } from './dto/update-suboutput.dto';

@Controller('suboutput')
export class SuboutputController {
  constructor(private readonly suboutputService: SuboutputService) {}

  @Post()
  create(@Body() createSuboutputDto: CreateSuboutputDto) {
    return this.suboutputService.create(createSuboutputDto);
  }

  @Get()
  findAll() {
    return this.suboutputService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suboutputService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuboutputDto: UpdateSuboutputDto) {
    return this.suboutputService.update(+id, updateSuboutputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suboutputService.remove(+id);
  }
}
