import { Activity } from '@/core/activity/domain/entities/activity.entity';
import { Either, left, right } from '@/shared/core/validation';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly photo?: string,
    public readonly activities: Activity[] = [],
  ) {}

  public static create(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    photo?: string;
    activities?: Activity[];
  }): Either<Error, User> {
    if (!props.email.includes('@')) {
      return left(new Error('Email inválido'));
    }

    return right(new User(
      props.id || '',
      props.name,
      props.email,
      props.password,
      props.photo,
      props.activities || [],
    ));
  }
}