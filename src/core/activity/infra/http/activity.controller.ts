import { CreateActivityDtoType } from '@/core/activity/application/dto/create-activity.dto';
import { CreateActivityUseCase } from '@/core/activity/use-cases/create-activity.use-case';
import { UserPayload } from '@/core/auth/application/types/user-payload';
import { CurrentUser } from '@/core/auth/infra/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/core/auth/infra/guards/jwt-auth.guard';
import { UserNotFoundError } from '@/core/user/domain/errors/user-not-found.error';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UpdateActivityDtoType } from '../../application/dto/update-activity.dto';
import { ActivityRepository } from '../../application/repository/activity.repository';
import { DeleteActivityUseCase } from '../../use-cases/delete-activity.use-case';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(
    private readonly createActivityUseCase: CreateActivityUseCase,
    private readonly activityRepository: ActivityRepository,
    private readonly deleteActivityUseCase: DeleteActivityUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateActivityDtoType
  ) {
    const result = await this.createActivityUseCase.execute(body, user.sub);
    
    if (result.isRight()) {
      const activity = result.value;
      return {
        id: activity.id,
        name: activity.name,
        duration: activity.duration,
        intensity: activity.intensity,
        distance: activity.distance,
        score: activity.score,
        photo: activity.photo,
        createdAt: activity.createdAt,
      };
    }
  
    if (result.value instanceof UserNotFoundError) {
      throw new NotFoundException(result.value.message);
    }
  
    throw new BadRequestException(result.value.message || 'Failed to create activity');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.activityRepository.findById(id);
    
    if (result.isRight()) {
      const activity = result.value;
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      return activity;
    }

    throw new BadRequestException(result.value.message);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateActivityDtoType
  ) {
    const findResult = await this.activityRepository.findById(id);
    if (findResult.isLeft() || !findResult.value) {
      throw new NotFoundException('Activity not found');
    }

    const existingActivity = findResult.value;
    const updatedActivity = {
      ...existingActivity,
      ...updateData
    };

    const updateResult = await this.activityRepository.update(id, updatedActivity);
    if (updateResult.isLeft()) {
      throw new BadRequestException(updateResult.value.message);
    }

    return updateResult.value;
  }

  @Delete(':id')
  async execute(
     @Param('id') id: string,
   ) {
    const result = await this.deleteActivityUseCase.execute(id);
     
    if (result.isLeft()) {
      throw result.value;
    }
 
    return { success: true, message: 'Atividade deletado com sucesso' };
   }
}