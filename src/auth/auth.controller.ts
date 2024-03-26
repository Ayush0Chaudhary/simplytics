import { Controller, Get, Post, Req, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { log } from 'console';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async handleLogin(
    @Req() req: any,
    // @Res({ passthrough: true }) response: Response,
  ) {
    const code = req.headers['authorization'].split(' ')[1];

    if (code.toString() === 'null') {
      return 'Github  auth failed you bruh';
    }
    const result = await this.authService.login(code);
    log('result', result);
    return result;
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Get('p')
  getP() {
    return 'csvsd';
  }
}
