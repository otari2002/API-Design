import { Module } from '@nestjs/common';
import { SubflowService } from './subflow.service';
import { SubflowController } from './subflow.controller';

@Module({
  controllers: [SubflowController],
  providers: [SubflowService],
})
export class SubflowModule {}
