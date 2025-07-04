import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { UpdateActivityDtoType } from '../application/dto/update-activity.dto';
import { ActivityRepository } from '../application/repository/activity.repository';
import { Activity } from '../domain/entities/activity.entity';
import { ActivityNotFoundError } from '../domain/errors/activity-not-found.error';
import { ActivityIntensity } from '../domain/types/intensity.type';

@Injectable()
export class UpdateActivityUseCase {
  constructor(
    private readonly activityRepo: ActivityRepository,
  ) {}

  private calculateScore(duration: number, intensity: ActivityIntensity, distance?: number): number {
    const intensityFactors = { low: 1, medium: 1.5, high: 2 };
    const baseScore = duration * intensityFactors[intensity];
    return distance ? Math.round(baseScore * distance * 0.1) : Math.round(baseScore);
  }

  async execute(
    activityId: string,
    updateData: UpdateActivityDtoType
  ): Promise<Either<ActivityNotFoundError | Error, Activity>> {
    try {
      const existingResult = await this.activityRepo.findById(activityId);
      if (existingResult.isLeft() || !existingResult.value) {
        return left(new ActivityNotFoundError());
      }
      const existingActivity = existingResult.value;

      const updatedProps = {
        ...existingActivity,
        ...updateData,
        score: this.calculateScore(
          updateData.duration ?? existingActivity.duration,
          updateData.intensity ?? existingActivity.intensity,
          updateData.distance ?? existingActivity.distance
        ),
      };

      const activityResult = Activity.create(updatedProps);
      if (activityResult.isLeft()) {
        return left(activityResult.value);
      }

      const updateResult = await this.activityRepo.update(
        activityId,
        activityResult.value
      );
      if (updateResult.isLeft()) {
        return left(updateResult.value);
      }

      return right(updateResult.value);
    } catch (error) {
      console.error('UpdateActivityError:', error);
      return left(error instanceof Error ? error : new Error('Failed to update activity'));
    }
  }
}