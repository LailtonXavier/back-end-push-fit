export class ActivityNotFoundError extends Error {
  constructor() {
    super('Activity not found');
    this.name = 'ActivityNotFoundError';
  }
}