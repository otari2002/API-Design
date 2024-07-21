import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InputService } from './input.service';
import { CreateInputDto } from './dto/create-input.dto';
import { UpdateInputDto } from './dto/update-input.dto';

@Controller('input')
export class InputController {
  constructor(private readonly inputService: InputService) {}

  @Post()
  create(@Body() createInputDto: CreateInputDto) {
    return this.inputService.create(createInputDto);
  }

  @Get()
  findAll() {
    return this.inputService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inputService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInputDto: UpdateInputDto) {
    return this.inputService.update(+id, updateInputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inputService.remove(+id);
  }
}
