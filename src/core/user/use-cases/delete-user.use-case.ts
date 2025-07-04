import { Injectable } from '@nestjs/common';
import { left, right } from '@/shared/core/validation';
import { UserRepository } from '../application/repository/user.repository';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(userId: string, password: string) {
    try {
      const userExists = await this.usersRepository.findById(userId);
      console.log('userExists', userExists)

      if (!userExists) {
        return left(new UserNotFoundError());
      }

      if (!await bcrypt.compare(password, userExists.password)) {
        return left(new ValidationError('Senha incorreta. Por favor, tente novamente.'));
      }
            
      const deleted = await this.usersRepository.delete(userId);
      if (!deleted) {
        return left(new ValidationError('Falha ao deletar usuário'));
      }

      return right(true);
    } catch (error) {
      return left(new ValidationError('Erro durante a exclusão do usuário'));
    }
  }
}