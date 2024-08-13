import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { FlowModule } from './flow/flow.module';;
import { SubflowModule } from './subflow/subflow.module';
import { BackendModule } from './backend/backend.module';

@Module({
  imports: [ProxyModule, FlowModule, SubflowModule, BackendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
