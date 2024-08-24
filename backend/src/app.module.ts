import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { FlowModule } from './flow/flow.module';;
import { SubflowModule } from './subflow/subflow.module';
import { BackendModule } from './backend/backend.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, FlowModule, SubflowModule, BackendModule, AuthModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
