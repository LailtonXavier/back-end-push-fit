import { Either } from '@/shared/core/validation';
import { Activity } from '../../domain/entities/activity.entity';

export abstract class ActivityRepository {
  abstract create(activity: Activity): Promise<Either<Error, Activity>>;
  abstract update(id: string, activity: Activity): Promise<Either<Error, Activity>>;
  abstract findById(id: string): Promise<Either<Error, Activity | null>>;
  abstract delete(ActivityId: string): Promise<boolean>;
}
