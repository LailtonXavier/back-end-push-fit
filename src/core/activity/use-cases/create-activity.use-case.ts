import { UserRepository } from '@/core/user/application/repository/user.repository';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { CreateActivityDtoType } from '../application/dto/create-activity.dto';
import { ActivityRepository } from '../application/repository/activity.repository';
import { Activity } from '../domain/entities/activity.entity';
import { ActivityNotFoundError } from '../domain/errors/activity-not-found.error';

@Injectable()
export class CreateActivityUseCase {
  constructor(
    private readonly activityRepo: ActivityRepository,
    private readonly userRepo: UserRepository
  ) {}

  private calculateScore(duration: number, intensity: string, distance?: number): number {
    const intensityFactors = { low: 1, medium: 1.5, high: 2 };
    const baseScore = duration * intensityFactors[intensity];
    return distance ? Math.round(baseScore * distance * 0.1) : baseScore;
  }

  async execute(
    dto: CreateActivityDtoType,
    userId: string
  ): Promise<Either<ActivityNotFoundError | Error, Activity>> {
    try {
      const userExists = await this.userRepo.findById(userId);
      if (!userExists) {
        return left(new ActivityNotFoundError());
      }

      const score = this.calculateScore(dto.duration, dto.intensity, dto.distance);

      const activityResult = Activity.create({
        name: dto.name,
        duration: dto.duration,
        intensity: dto.intensity,
        userId,
        score,
        createdAt: dto.createdAt,
        distance: dto.distance,
        photo: dto.photo,
      });

      if (activityResult.isLeft()) {
        return left(activityResult.value);
      }

      const createResult = await this.activityRepo.create(activityResult.value);
      if (createResult.isLeft()) {
        return left(createResult.value);
      }

      return right(createResult.value);      
    } catch (error) {
      return left(error instanceof Error ? error : new Error('Failed to create activity'));
    }
  }
}