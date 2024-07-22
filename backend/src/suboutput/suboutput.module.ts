import { Module } from '@nestjs/common';
import { SubOutputService } from './suboutput.service';
import { SuboutputController } from './suboutput.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [SuboutputController],
  providers: [SubOutputService],
})
export class SuboutputModule {}
