import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubinputService } from './subinput.service';
import { CreateSubinputDto } from './dto/create-subinput.dto';
import { UpdateSubinputDto } from './dto/update-subinput.dto';

@Controller('subinput')
export class SubinputController {
  constructor(private readonly subinputService: SubinputService) {}

  @Post()
  create(@Body() createSubinputDto: CreateSubinputDto) {
    return this.subinputService.create(createSubinputDto);
  }

  @Get()
  findAll() {
    return this.subinputService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subinputService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubinputDto: UpdateSubinputDto) {
    return this.subinputService.update(+id, updateSubinputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subinputService.remove(+id);
  }
}
