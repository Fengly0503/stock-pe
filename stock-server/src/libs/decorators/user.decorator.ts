import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  const request = req.switchToHttp().getRequest();
  return request.user;
});
