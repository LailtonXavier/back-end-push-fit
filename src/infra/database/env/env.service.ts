import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class EnvService {
  constructor() {
    dotenv.config();
  }

  get(key: string): string | undefined {
    return process.env[key];
  }
}