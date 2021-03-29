import {
  Controller,
  Get,
  Body,
  Post,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BusiException } from '../../libs/filters/busi.exception';
import { BusiErrorCode } from '../../libs/enums/error-code-enum';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../libs/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from '../../libs/enums/role-enum';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('sayhi')
  async sayhi(): Promise<string> {
    return '你好，世界';
  }

  @Get('exception')
  async exception(): Promise<string> {
    // throw new BusiException(BusiErrorCode.NOT_FOUND, '缺省状态码，默认触发http 400错误');
    throw new BusiException(
      BusiErrorCode.NOT_FOUND,
      '错误：http状态正常',
      HttpStatus.OK,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create')
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }
}
