import { Module } from '@nestjs/common';
import { SubInputService } from './subinput.service';
import { SubinputController } from './subinput.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [SubinputController],
  providers: [SubInputService],
})
export class SubinputModule {}
