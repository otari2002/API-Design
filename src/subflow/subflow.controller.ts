import { Controller, Get, Param } from '@nestjs/common';
import { SubFlowService } from './subflow.service';
@Controller('subflow')
export class SubflowController {
  constructor(private readonly subflowService: SubFlowService) {}

  @Get()
  findAll() {
    return this.subflowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subflowService.findOne(+id);
  }

}
