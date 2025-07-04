import { Injectable } from '@nestjs/common';
import { left, right, validate } from '@/shared/core/validation';
import { CreateUserDtoType } from '../application/dto/create-user.dto';
import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../application/repository/user.repository';
import { EmailInUseError } from '../domain/errors/email-in-use.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  private async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new ValidationError('Password is required');
    }
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async execute(data: CreateUserDtoType) {
    const emailCheck = await validate(
      !(await this.usersRepository.findByEmail(data.email)),
      EmailInUseError
    );

    if (emailCheck.isLeft()) {
      return left(emailCheck.value);
    }

    if (!data.password) {
      return left(new ValidationError('Password is required'));
    }

    try {
      const hashedPassword = await this.hashPassword(data.password);

      const userOrError = User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        photo: data.photo
      });

      if (userOrError.isLeft()) {
        return left(new ValidationError(userOrError.value.message));
      }

      const user = await this.usersRepository.create(userOrError.value);
      return right(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        return left(error);
      }
      return left(new ValidationError('Falha ao criar usuário'));
    }
  }
}