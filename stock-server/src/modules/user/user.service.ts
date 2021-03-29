import { Injectable } from '@nestjs/common';
import { StUser } from '../../entities/StUser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');
import { BusiException } from '../../libs/filters/busi.exception';
import { BusiErrorCode } from '../../libs/enums/error-code-enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(StUser)
    private readonly stUserRepository: Repository<StUser>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.stUserRepository.create(dto);
    const salt = bcrypt.genSaltSync(10);
    user.salt = salt;
    user.password = bcrypt.hashSync(user.password, salt);
    return this.stUserRepository
      .save(user)
      .then((res) => {
        return { id: res.id };
      })
      .catch((err) => {
        throw new BusiException(BusiErrorCode.PARAM_ERROR, err.message);
      });
  }

  async findByMobile(mobile: string): Promise<StUser> {
    const result = await this.stUserRepository.findOne({ mobile });
    return result;
  }
}
