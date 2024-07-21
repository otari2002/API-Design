import { Module } from '@nestjs/common';
import { RequestmappingService } from './requestmapping.service';
import { RequestmappingController } from './requestmapping.controller';

@Module({
  controllers: [RequestmappingController],
  providers: [RequestmappingService],
})
export class RequestmappingModule {}
