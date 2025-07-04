import { forwardRef, Module } from '@nestjs/common';
import { CreateUserUseCase } from '@/core/user/use-cases/create-user.use-case';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { UserController } from '@/core/user/infra/http/controllers/user.controller';
import { UserRepository } from './application/repository/user.repository';
import { PrismaUserRepository } from './infra/prisma/repositories/prisma-user.repository.ts';
import { UserService } from './user.service';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';
import { AuthModule } from '../auth/auth.module';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    FindUserByIdUseCase,
    DeleteUserUseCase,
    PrismaService,
    UserService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
