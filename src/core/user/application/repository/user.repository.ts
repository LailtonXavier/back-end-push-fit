import { User } from '../../domain/entities/user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract update(id: string, user: User): Promise<User>;
  abstract delete(userId: string): Promise<boolean>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
