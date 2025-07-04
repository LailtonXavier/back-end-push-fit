import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { UserNotFoundError } from '@/core/user/domain/errors/user-not-found.error';

@Catch(UserNotFoundError)
export class UserErrorsFilter extends BaseExceptionFilter {
  catch(exception: UserNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}