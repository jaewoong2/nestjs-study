// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserPayload {
  id: number;
  username: string;
  email: string;
  // 기타 필요한 속성들...
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { user: UserPayload } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
