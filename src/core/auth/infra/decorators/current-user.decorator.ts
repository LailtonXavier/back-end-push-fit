import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../application/types/request-with-user.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  }
);