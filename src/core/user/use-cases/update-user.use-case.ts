import { Injectable } from '@nestjs/common';
import { Either, left, right, validate } from '@/shared/core/validation';
import { UserRepository } from '../application/repository/user.repository';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { User } from '../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDtoType } from '../application/dto/update-user.dto';
import { EmailInUseError } from '../domain/errors/email-in-use.error';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  private async hashPassword(password?: string): Promise<string | undefined> {
    if (!password) return undefined;
    const saltRounds = 5;
    return await bcrypt.hash(password, saltRounds);
  }

  async execute(userId: string, updateData: UpdateUserDtoType): Promise<Either<Error, User>> {
    try {
      const existingUser = await this.usersRepository.findById(userId);
      if (!existingUser) {
        return left(new UserNotFoundError());
      }

      if (updateData.email && updateData.email !== existingUser.email) {
        const emailCheck = await validate(
          !(await this.usersRepository.findByEmail(updateData.email)),
          EmailInUseError
        );
        if (emailCheck.isLeft()) {
          return left(emailCheck.value);
        }
      }

      const hashedPassword = updateData.password 
        ? await this.hashPassword(updateData.password)
        : undefined;

      const updatedUserOrError = User.create({
        ...existingUser,
        ...updateData,
        password: hashedPassword || existingUser.password,
      });

      if (updatedUserOrError.isLeft()) {
        return left(new ValidationError(updatedUserOrError.value.message));
      }

      const updatedUser = await this.usersRepository.update(
        userId,
        updatedUserOrError.value
      );

      return right(updatedUser);
    } catch (error) {
      return left(new ValidationError('Falha ao atualizar usuário'));
    }
  }
}