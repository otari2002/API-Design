import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubInputService } from './subinput.service';
import { CreateSubInputDto } from './dto/create-subinput.dto';
import { UpdateSubInputDto } from './dto/update-subinput.dto';

@Controller('subinput')
export class SubinputController {
  constructor(private readonly subinputService: SubInputService) {}

  @Post()
  create(@Body() createSubinputDto: CreateSubInputDto) {
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
  update(@Param('id') id: string, @Body() updateSubinputDto: UpdateSubInputDto) {
    return this.subinputService.update(+id, updateSubinputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subinputService.remove(+id);
  }
}
