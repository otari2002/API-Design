import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { FlowService } from './flow.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { Request, Response } from 'express';

@Controller("flow")
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post()
  create(@Body() createFlowDto: CreateFlowDto,@Req() req: Request, @Res() res: Response) {
    console.log("createFlowDto; ", createFlowDto);
    
    return this.flowService.create(createFlowDto,req,res);
  }

  @Get()
  findAll() {
    return this.flowService.findAll();
  }

  @Get('detailed/:id')
  findDetailedFlow(@Param('id') id: string) {
    return this.flowService.findDetailedFlow(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlowDto: UpdateFlowDto,@Req() req: Request, @Res() res: Response) {
    console.log("updateFlowDto");
    console.log(updateFlowDto.outputs);
    
    return this.flowService.update(+id, updateFlowDto,req,res);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.flowService.remove(+id);
  }
}