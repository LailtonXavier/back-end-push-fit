import { UserPayload } from '@/core/auth/application/types/user-payload';
import { CurrentUser } from '@/core/auth/infra/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/core/auth/infra/guards/jwt-auth.guard';
import { CreateUserDtoType } from '@/core/user/application/dto/create-user.dto';
import { UpdateUserDtoType } from '@/core/user/application/dto/update-user.dto';
import { EmailInUseError } from '@/core/user/domain/errors/email-in-use.error';
import { CreateUserUseCase } from '@/core/user/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '@/core/user/use-cases/delete-user.use-case';
import { FindUserByIdUseCase } from '@/core/user/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/core/user/use-cases/update-user.use-case';
import { getErrorMessage } from '@/shared/core/validation';
import { BadRequestException, Body, ConflictException, Controller, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDtoType) {
    const result = await this.createUser.execute(body);
    
    if (result.isLeft()) {
      const error = result.value;
      
      if (error instanceof EmailInUseError) {
        throw new ConflictException(error.message);
      }
      
      throw new BadRequestException(getErrorMessage(error));
    }
    
    return result.value;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() currentUser: { sub: string },
    @Body() updateData: UpdateUserDtoType
  ) {
    if (currentUser.sub !== id) {
      throw new ForbiddenException('Você só pode atualizar sua própria conta');
    }

    const result = await this.updateUserUseCase.execute(id, updateData);
    
    if (result.isLeft()) {
      throw result.value;
    }

    const { password, ...userWithoutPassword } = result.value;
    return userWithoutPassword;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findById(
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.findUserByIdUseCase.execute(user.sub);
    
    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value;
  }

  @Post(':id/delete')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async execute(
    @Param('id') id: string,
    @Body('password') password: string,
    @CurrentUser() user: UserPayload
  ) {

    if (user.sub !== id) {
      throw new ForbiddenException('Você só pode deletar sua própria conta');
    }

    const result = await this.deleteUserUseCase.execute(id, password);
    
    if (result.isLeft()) {
      throw result.value;
    }

    return { success: true, message: 'Usuário deletado com sucesso' };
  }
}
