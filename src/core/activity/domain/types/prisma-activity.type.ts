export type PrismaActivity = {
  id: string;
  name: string;
  duration: number;
  intensity: string;
  userId: string;
  photo: string | null;
  createdAt: Date;
  distance: number | null;
  score: number | null;
};