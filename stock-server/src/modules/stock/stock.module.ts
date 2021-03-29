import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StUser } from '../../entities/StUser';
import { Stock } from '../../entities/Stock';
import { TasksService } from './tasks/sync-source.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StUser, Stock]), HttpModule],
  providers: [TasksService, StockService],
  controllers: [StockController],
})
export class StockModule {}
