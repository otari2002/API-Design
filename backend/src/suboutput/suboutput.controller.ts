import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubOutputService } from './suboutput.service';
import { CreateSubOutputDto } from './dto/create-suboutput.dto';
import { UpdateSubOutputDto } from './dto/update-suboutput.dto';

@Controller('suboutput')
export class SuboutputController {
  constructor(private readonly suboutputService: SubOutputService) {}

  @Post()
  create(@Body() createSuboutputDto: CreateSubOutputDto) {
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
  update(@Param('id') id: string, @Body() updateSuboutputDto: UpdateSubOutputDto) {
    return this.suboutputService.update(+id, updateSuboutputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suboutputService.remove(+id);
  }
}
