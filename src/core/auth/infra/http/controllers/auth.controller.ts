import { LoginDto } from '@/core/auth/application/dto/login.dto';
import { RegisterDto } from '@/core/auth/application/dto/register.dto';
import { RequestWithUser } from '@/core/auth/application/types/request-with-user.type';
import { AuthService } from '@/core/auth/services/auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@CurrentUser() user: RequestWithUser['user']) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}