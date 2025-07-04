import { Activity } from '@/core/activity/domain/entities/activity.entity';
import { ActivityIntensity } from '@/core/activity/domain/types/intensity.type';
import { UserRepository } from '@/core/user/application/repository/user.repository';
import { User } from '@/core/user/domain/entities/user.entity';
import { PrismaUser } from '@/core/user/domain/types/prisma-user.type';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id || undefined,
        name: user.name,
        email: user.email,
        password: user.password,
        photo: user.photo,
      },
    });

    return new User(
      createdUser.id,
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.photo
    );
  }

  async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        photo: user.photo,
        updatedAt: new Date(),
      },
    });
  
    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.photo
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    });
    return user ? this.toDomain(user) : null;
  }

  private toDomain(user: PrismaUser): User {
    const activities = (user.activities || []).map(activity => {
      const result = Activity.create({
        id: activity.id,
        name: activity.name,
        duration: activity.duration,
        intensity: activity.intensity as ActivityIntensity,
        userId: activity.userId,
        createdAt: activity.createdAt,
        photo: activity.photo ?? undefined,
        distance: activity.distance ?? undefined,
        score: activity.score ?? undefined
      });
  
      if (result.isLeft()) {
        throw result.value;
      }
      return result.value;
    });
  
    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.photo ?? undefined,
      activities
    );
  }  

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Erro ao deletar no Prisma:', error);
      return false;
    }
  }
  
}