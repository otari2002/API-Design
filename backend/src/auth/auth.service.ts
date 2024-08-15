import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    email: string,
    password: string
  ): Promise<{ token: string; expires: Date}> {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if(existingUser) {
        throw new UnauthorizedException("User already exists");
    }
    const user = await this.prisma.user.create({
      data: { email, password },
    });

    const { token, expires } = await this.generateAndStoreToken(user);

    return { token, expires };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; expires: Date }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { token, expires } = await this.generateAndStoreToken(user);

    return { token, expires };
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
    user: User
  ): Promise<{ token: string; expires: Date }> {
    const token = this.jwtService.sign({ userId: user.id });
    const expires = new Date(Date.now() + 10 * 60 * 60 * 1000);

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
}
