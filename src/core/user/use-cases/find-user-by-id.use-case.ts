import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../application/repository/user.repository';
import { User } from '../domain/entities/user.entity';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Either<UserNotFoundError, User>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(user);
  }
}