import { Module } from '@nestjs/common';
import { SubFlowService } from './subflow.service';
import { SubflowController } from './subflow.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [SubflowController],
  providers: [SubFlowService],
})
export class SubflowModule {}
