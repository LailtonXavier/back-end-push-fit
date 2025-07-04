import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  async signAccessToken(payload: { sub: string; email: string }): Promise<string> {
    return this.nestJwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });
  }

  async signRefreshToken(payload: { sub: string; email: string }): Promise<string> {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '1d',
    });
  }

  async verifyRefreshToken(token: string): Promise<{ sub: string }> {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { sub: string };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}