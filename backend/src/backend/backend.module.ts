import { Module } from '@nestjs/common';
import { BackendService } from './backend.service';
import { BackendController } from './backend.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [BackendController],
  providers: [BackendService],
})
export class BackendModule {}
