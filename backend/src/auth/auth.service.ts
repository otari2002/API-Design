import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
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

  async resetPassword(
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
      return { error: error, message: "Failed to reset password" };
    }
  }

  async validateUser(token: string): Promise<User> {
    const session = await this.prisma.session.findUnique({ where: { token } });

    if (!session || new Date() > session.expires) {
      throw new UnauthorizedException("Session expired or invalid");
    }

    const decoded = this.jwtService.verify(token);
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user;
  }

  async generateAndStoreToken(
    user: User, duration: number
  ): Promise<{ token: string; expires: Date }> {
    const token = this.jwtService.sign({ userId: user.id });

    const GMToffset = 3600 * 1000;

    const expires = new Date(Date.now() + GMToffset + duration);
    
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

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
}
