import { Module } from '@nestjs/common';
import { RequestMappingService } from './requestmapping.service';
import { RequestmappingController } from './requestmapping.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [RequestmappingController],
  providers: [RequestMappingService],
})
export class RequestmappingModule {}
