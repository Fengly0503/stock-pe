import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BusiException } from './busi.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    let code, message;
    if (exception instanceof BusiException) {
      code = exception.getErrorCode();
      message = exception.getErrorMessage();
    } else {
      code = exception.getStatus();
      message = exception.message;
    }
    response.status(status).json({
      code,
      message,
      data: null,
      date: new Date().toLocaleDateString(),
      path: request.url,
    });
  }
}
