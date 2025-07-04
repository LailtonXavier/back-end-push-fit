import { EnvModule } from '@/infra/database/env/env.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './infra/constants';
import { AuthController } from './infra/http/controllers/auth.controller';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { RefreshTokenStrategy } from './infra/strategies/refresh-token.strategy';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Module({
  imports: [
    EnvModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    JwtModule,
    AuthService,
    JwtService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtService, JwtModule],
})
export class AuthModule {}