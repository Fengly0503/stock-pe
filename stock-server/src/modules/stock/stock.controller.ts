import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockQueryDto } from './dto/stock.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { User } from '../../libs/decorators/user.decorator';
import { ProfileInfo } from '../../libs/decorators/profileInfo';
import { UserStockDto } from './dto/stock.dto';

@Controller('stock')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly userService: StockService) {}

  @UseGuards(RolesGuard)
  @Post('list')
  async getStockList(@Body() parmas: StockQueryDto, @User() user: ProfileInfo) {
    return this.userService.getStockList(user.uid, parmas);
  }

  @UseGuards(RolesGuard)
  @Post('add-choice')
  async addChoice(@Body() parmas: UserStockDto, @User() user: ProfileInfo) {
    return this.userService.addUserStock(user.uid, parmas.code);
  }

  @UseGuards(RolesGuard)
  @Post('user-list')
  async getUserStocts(
    @Body() parmas: StockQueryDto,
    @User() user: ProfileInfo,
  ) {
    return this.userService.getUserStocts(user.uid, parmas);
  }

  @UseGuards(RolesGuard)
  @Post('delete-choice')
  async deleteChoice(@Body() parmas: UserStockDto, @User() user: ProfileInfo) {
    return this.userService.deleteUserStock(user.uid, parmas.code);
  }
}
