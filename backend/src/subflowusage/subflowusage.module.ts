import { Module } from '@nestjs/common';
import { SubFlowUsageService } from './subflowusage.service';
import { SubflowusageController } from './subflowusage.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [SubflowusageController],
  providers: [SubFlowUsageService],
})
export class SubflowusageModule {}
