import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { FlowModule } from './flow/flow.module';
import { InputModule } from './input/input.module';
import { OutputModule } from './output/output.module';
import { SubflowModule } from './subflow/subflow.module';
import { BackendModule } from './backend/backend.module';
import { RequestmappingModule } from './requestmapping/requestmapping.module';
import { SubinputModule } from './subinput/subinput.module';
import { SuboutputModule } from './suboutput/suboutput.module';
import { SubflowusageModule } from './subflowusage/subflowusage.module';

@Module({
  imports: [ProxyModule, FlowModule, InputModule, OutputModule, SubflowModule, BackendModule, RequestmappingModule, SubinputModule, SuboutputModule, SubflowusageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
