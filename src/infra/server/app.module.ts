import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '../database/env/env.module';
import { UserModule } from '@/core/user/user.module';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from '@/core/auth/auth.module';
import { ActivityModule } from '@/core/activity/activity.module';

@Module({
  imports: [PrismaModule, EnvModule, AuthModule, UserModule, ActivityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
