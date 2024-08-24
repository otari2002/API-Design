import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret1234',
      signOptions: { expiresIn: '10h' },
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MailerService],
})
export class AuthModule {}
