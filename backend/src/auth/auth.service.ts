import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { SendEmailDto } from "src/mailer/dto/send_email_dto";
import { MailerService } from "src/mailer/mailer.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async register(
    email: string,
    password: string
  ): Promise<{ message: string, error?: string }> {
    try{
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new UnauthorizedException("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      return {
        message: "User registered successfully"
      }
    }catch(error){
      return { error: error, message: "Failed to register" };
    }

  }

  async login(
    email: string,
    password: string,
    rememberUser: boolean | null
  ): Promise<{ token: string; expires: Date, message?: string }> {
    try{
      const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const duration = rememberUser ? 
      this.durationToMilliseconds("24h") * 30 : this.durationToMilliseconds("10m");

    const { token, expires } = await this.generateAndStoreToken(user, duration);

    return { token, expires };
    }catch(error){
      return { token: null, expires: null };
    }
  }

  async editPassword(
    email: string,
    currentPassword: string,
    password: string
  ): Promise<{message: string, error?: string}> {
    try{
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return { error: "wrong data", message: "Invalid credentials" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      return { message: "Password updated successfully" };
    } catch (error) {
      return { error: error, message: "Failed to edit password" };
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const existingRequest = await this.prisma.passwordResetToken.findFirst({
      where: { userId: user.id },
    });
    const GMToffset = 3600 * 1000;
    if (!user) {
      throw new UnauthorizedException("Email not found");
    }
    if(existingRequest){
      if(existingRequest.expires > new Date(Date.now() + GMToffset) ){
        throw new UnauthorizedException("Password reset request already sent");
      }else{
        await this.prisma.passwordResetToken.delete({ where: { id: existingRequest.id } });
      }
    }
  
    const duration = this.durationToMilliseconds("10m");
    const { token, expires } = await this.generateAndStoreToken(user, duration, "password");
  
    const expirationTime = new Date(expires).toLocaleString();
  
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

  const dto: SendEmailDto = {
    recipient: { name: '', address: user.email },
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #4CAF50;">Password Reset</h2>
        <p style="font-size: 16px; color: #333;">Hello, {{name}}</p>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your password. Please click the link below to reset your password.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="display: inline-block; font-size: 18px; color: #fff; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Your Password
          </a>
        </div>
        <p style="font-size: 16px; color: #333;">
          This link will expire on <strong>${expirationTime}</strong>.
        </p>
        <p style="font-size: 16px; color: #333;">
          If you did not request a password reset, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #333;">
          Best regards,<br/>
          The Team
        </p>
      </div>
    `,
      placeholders: { name: user.email },
    };
  
    await this.sendMail(dto);
  }

  async validateResetPasswordToken(token: string): Promise<{ message?: string }> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    const GMToffset = 3600 * 1000;
    if (!resetToken || new Date(Date.now() + GMToffset) > resetToken.expires) {
      throw new UnauthorizedException("Invalid or expired token");
    }
    return { message: "Token is valid" };
  }

  async resetPassword(token: string, password: string): Promise<{ message: string, error?: string }> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    const GMToffset = 3600 * 1000;
    if (!resetToken || new Date(Date.now() + GMToffset) > resetToken.expires) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return { message: "Password reset successfully" };
  }
  
  async validateUser(token: string): Promise<any> {
    const session = await this.prisma.session.findUnique({ where: { token } });
    const GMToffset = 3600 * 1000;
    if (!session || new Date(Date.now() + GMToffset) > session.expires) {
      return null;
    }

    const decoded = this.jwtService.verify(token);
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user;
  }

  async generateAndStoreToken(
    user: User, duration: number, type: string  = "session"
  ): Promise<{ token: string; expires: Date }> {
    const token = this.jwtService.sign({ userId: user.id });

    const GMToffset = 3600 * 1000;
    const expires = new Date(Date.now() + GMToffset + duration);
    
    switch (type) {
      case "password":
        await this.prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token,
            expires,
          },
        });
        break;
      case "session":
        await this.prisma.session.create({
          data: {
            userId: user.id,
            token,
            expires,
          },
        });
        break;
      default:
        return { token : null, expires: null };
    }

    return { token, expires };
  }

  async logout(token: string): Promise<void> {
    await this.prisma.session.delete({ where: { token } });
  }

  durationToMilliseconds(duration: string) {
    var result = 0;
    const values = duration.split("-");
    values.forEach(x => {
      const type = x.at(-1);
      switch (type) {
        case "s":
          result += parseInt(x) * 1000;
          break;
        case "m":
          result += parseInt(x) * 1000 * 60;
          break;
        case "h":
          result += parseInt(x) * 1000 * 60 * 60;
          break;
        default:
          return;
      }
    });
    return result;
  }

  async sendMail(dto: SendEmailDto): Promise<any> {
    return await this.mailerService.sendMail(dto);
  }
}
