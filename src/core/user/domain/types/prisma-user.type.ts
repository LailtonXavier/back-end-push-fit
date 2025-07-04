import { Activity } from '@/core/activity/domain/entities/activity.entity';

export type PrismaUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  photo: string | null;
  activities?: { 
    id: string;
    name: string;
    duration: number;
    intensity: string;
    userId: string;
    createdAt: Date;
    photo: string | null;
    distance: number | null;
    score: number | null;
  }[];
};

export type DomainUserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  activities: Activity[];
};