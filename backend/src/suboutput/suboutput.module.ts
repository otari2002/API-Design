import { Module } from '@nestjs/common';
import { SuboutputService } from './suboutput.service';
import { SuboutputController } from './suboutput.controller';

@Module({
  controllers: [SuboutputController],
  providers: [SuboutputService],
})
export class SuboutputModule {}
