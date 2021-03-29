import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from './libs/interceptors/data.interceptor';
import { HttpExceptionFilter } from './libs/filters/http-exception.filter';
import { ParamsValidationPipe } from './libs/pipes/params-validation.pipe';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ParamsValidationPipe());
  await app.listen(3000);
}
bootstrap();
