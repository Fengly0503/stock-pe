import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../libs/enums/role-enum';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(mobile: string, pass: string): Promise<any> {
    const user = await this.usersService.findByMobile(mobile);
    if (user) {
      const userpwd = bcrypt.hashSync(pass, user.salt);
      if (user.password === userpwd) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    let roles = [];
    if (user.role === 100) {
      roles = [UserRole.ADMIN];
    } else {
      roles = [UserRole.USER];
    }
    const payload = {
      id: user.id,
      mobile: user.mobile,
      sub: user.id,
      roles,
      name: user.name,
      avatar: user.avatar,
    };
    return {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      roles,
      avatar: user.avatar,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
