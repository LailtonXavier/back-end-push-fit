import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/core/user/user.service';
import { RegisterDto } from '../application/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

    return user;
  }

  async login(user: { id: string; email: string }) {
    const accessToken = await this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = await this.jwtService.signRefreshToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      photo: registerDto.photo,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Usuário não encontrado');

      return this.jwtService.signAccessToken({
        sub: user.id,
        email: user.email,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      await this.jwtService.verifyRefreshToken(refreshToken);
  
      const payload = { 
        sub: user.id,
        email: user.email,
      };
      
      return {
        access_token: await this.jwtService.signAccessToken(payload),
        refresh_token: await this.jwtService.signRefreshToken(payload),
      };
    } catch (error) {
      console.error('Refresh token error:', error.message);
      
      throw new UnauthorizedException(
        error instanceof UnauthorizedException 
          ? error.message 
          : 'Invalid refresh token'
      );
    }
  }
}