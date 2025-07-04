import { Either, right } from '@/shared/core/validation';
import { ActivityIntensity } from '../types/intensity.type';


export class Activity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly duration: number,
    public readonly intensity: ActivityIntensity,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly photo?: string,
    public readonly distance?: number,
    public readonly score?: number,
  ) {}

  public static create(props: {
    id?: string;
    name: string;
    duration: number;
    intensity: ActivityIntensity;
    userId: string;
    createdAt: Date;
    photo?: string | null;
    distance?: number;
    score?: number;
  }): Either<Error, Activity> {
    if (!['low', 'medium', 'high'].includes(props.intensity)) {
      throw new Error(`Invalid intensity value: ${props.intensity}`);
    }
    
    return right(new Activity(
      props.id || '',
      props.name,
      props.duration,
      props.intensity,
      props.userId,
      props.createdAt,
      props.photo || undefined,
      props.distance,
      props.score,
    ));
  }
}