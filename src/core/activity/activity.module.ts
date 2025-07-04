import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { forwardRef, Module } from '@nestjs/common';
import { CreateActivityUseCase } from './use-cases/create-activity.use-case';
import { AuthModule } from '../auth/auth.module';
import { ActivityRepository } from './application/repository/activity.repository';
import { PrismaActivityRepository } from './infra/prisma/repositories/prisma-activity.repository';
import { ActivityController } from './infra/http/activity.controller';
import { UserModule } from '../user/user.module';
import { UpdateActivityUseCase } from './use-cases/updatee-activity.use-case';
import { DeleteActivityUseCase } from './use-cases/delete-activity.use-case';

@Module({
  imports: [forwardRef(() => AuthModule), UserModule],
  controllers: [ActivityController],
  providers: [
    CreateActivityUseCase,
    UpdateActivityUseCase,
    DeleteActivityUseCase,
    PrismaService,
    {
      provide: ActivityRepository,
      useClass: PrismaActivityRepository,
    },
  ],
  exports: [],
})
export class ActivityModule {}
