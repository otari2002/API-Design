import { Module } from '@nestjs/common';
import { SubflowusageService } from './subflowusage.service';
import { SubflowusageController } from './subflowusage.controller';

@Module({
  controllers: [SubflowusageController],
  providers: [SubflowusageService],
})
export class SubflowusageModule {}
