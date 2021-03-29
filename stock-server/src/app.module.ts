import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { StockModule } from './modules/stock/stock.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: 'data base host',
      port: 3306,
      username: 'data base username',
      password: 'data base password',
      database: 'stock_demo',
      synchronize: false,
      entities: [__dirname + '/entities/*.js'],
    }),
    UserModule,
    AuthModule,
    StockModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
