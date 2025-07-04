import { ActivityRepository } from '@/core/activity/application/repository/activity.repository';
import { Activity } from '@/core/activity/domain/entities/activity.entity';
import { ActivityIntensity } from '@/core/activity/domain/types/intensity.type';
import { PrismaActivity } from '@/core/activity/domain/types/prisma-activity.type';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaActivityRepository implements ActivityRepository {
  constructor(private prisma: PrismaService) {}

  async create(activity: Activity): Promise<Either<Error, Activity>> {
    try {
      const created = await this.prisma.activity.create({
        data: {
          id: activity.id || undefined,
          name: activity.name,
          duration: activity.duration,
          intensity: activity.intensity,
          userId: activity.userId,
          photo: activity.photo,
          distance: activity.distance,
          score: activity.score,
          createdAt: activity.createdAt,
        },
      });
  
      return Activity.create({
        ...created,
        intensity: created.intensity as ActivityIntensity,
      });
    } catch (error) {
      return left(
        error instanceof Error ? 
        error : new Error('Failed to create activity'));
    }
  }

  async findById(id: string): Promise<Either<Error, Activity | null>> {
    try {
      const activity = await this.prisma.activity.findUnique({
        where: { id }
      });
      return activity ? this.toDomain(activity) : right(null);
    } catch (error) {
      return left(error instanceof Error ? error : new Error('Failed to find activity'));
    }
  }

  private toDomain(prismaActivity: PrismaActivity): Either<Error, Activity> {
    if (!['low', 'medium', 'high'].includes(prismaActivity.intensity.toLowerCase())) {
      return left(new Error(`Invalid intensity value: ${prismaActivity.intensity}`));
    }
  
    return Activity.create({
      id: prismaActivity.id,
      name: prismaActivity.name,
      duration: prismaActivity.duration,
      intensity: prismaActivity.intensity.toLowerCase() as ActivityIntensity,
      userId: prismaActivity.userId,
      photo: prismaActivity.photo ?? undefined,
      createdAt: prismaActivity.createdAt,
      distance: prismaActivity.distance ?? undefined,
      score: prismaActivity.score ?? undefined
    });
  }
  
  async update(id: string, activity: Activity): Promise<Either<Error, Activity>> {
    try {
      const updated = await this.prisma.activity.update({
        where: { id },
        data: {
          name: activity.name,
          duration: activity.duration,
          intensity: activity.intensity,
          photo: activity.photo,
          distance: activity.distance,
          score: activity.score,
        }
      });
  
      return Activity.create({
        ...updated,
        intensity: updated.intensity.toLowerCase() as ActivityIntensity,
      });
    } catch (error) {
      return left(error instanceof Error ? error : new Error('Failed to update activity'));
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.activity.delete({ where: { id }});
      return true;
    } catch {
      return false;
      }
  }
}