import { Module } from '@nestjs/common';
import { InputService } from './input.service';
import { InputController } from './input.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [InputController],
  providers: [InputService],
})
export class InputModule {}
