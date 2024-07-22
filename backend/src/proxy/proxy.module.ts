import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FlowModule } from 'src/flow/flow.module';

@Module({
  imports: [PrismaModule, FlowModule], 
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
