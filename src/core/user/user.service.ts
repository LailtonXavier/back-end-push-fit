import { Injectable } from '@nestjs/common';
import { UserRepository } from './application/repository/user.repository';
import { User } from './domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: {
    name: string;
    email: string;
    password: string;
    photo?: string;
  }): Promise<User> {
    return this.userRepository.create(
      User.create({
        ...userData,
      }).value as User
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

}