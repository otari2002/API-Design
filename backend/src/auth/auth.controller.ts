import { Controller, Post, Body, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('rememberUser') rememberUser?: boolean | null,
  ) {
    return this.authService.login(email, password, rememberUser);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

  @Get('session')
  async getSessionUser(@Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const user = await this.authService.validateUser(token);
    if(!user){
      throw new UnauthorizedException('Expired Token');
    }
    const { password, ...userData } = user;
    return userData;
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('currentPassword') currentPassword: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(email, currentPassword, password);
  }
}
