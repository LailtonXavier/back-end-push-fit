import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../application/repository/activity.repository';
import { ActivityNotFoundError } from '../domain/errors/activity-not-found.error';
import { left, right } from '@/shared/core/validation';
import { ValidationError } from '@/shared/core/errors/validation.error';

@Injectable()
export class DeleteActivityUseCase {
  constructor(private readonly activityRepo: ActivityRepository) {}

  async execute(activityId: string) {
    try {
      const existingResult = await this.activityRepo.findById(activityId);
     if (existingResult.isLeft() || !existingResult.value) {
        return left(new ActivityNotFoundError());
      }

      const deleted = await this.activityRepo.delete(activityId);
      if (!deleted) {
        return left(new ValidationError('Falha ao deletar atividade'));
      }

      return right(true)
    } catch (error) {
      return left(error instanceof Error ? error : new Error('Failed to delete activity'));
    }
  }
}