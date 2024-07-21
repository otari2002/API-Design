import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OutputService } from './output.service';
import { CreateOutputDto } from './dto/create-output.dto';
import { UpdateOutputDto } from './dto/update-output.dto';

@Controller('output')
export class OutputController {
  constructor(private readonly outputService: OutputService) {}

  @Post()
  create(@Body() createOutputDto: CreateOutputDto) {
    return this.outputService.create(createOutputDto);
  }

  @Get()
  findAll() {
    return this.outputService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outputService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutputDto: UpdateOutputDto) {
    return this.outputService.update(+id, updateOutputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outputService.remove(+id);
  }
}
