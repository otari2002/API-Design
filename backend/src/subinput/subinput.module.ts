import { Module } from '@nestjs/common';
import { SubinputService } from './subinput.service';
import { SubinputController } from './subinput.controller';

@Module({
  controllers: [SubinputController],
  providers: [SubinputService],
})
export class SubinputModule {}
