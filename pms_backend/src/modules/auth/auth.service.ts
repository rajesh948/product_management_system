import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return null;
    const match = await this.comparePassword(pass, user.password);
    if (!match) return null;
    const { carts, roleId, password, ...result } = user['dataValues'];

    return result;
  }
  async getLoginUserData(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return null;
    const { carts, roleId, password, ...result } = user['dataValues'];

    return result;
  }

  async create(user) {
    user.password = await this.hashPassword(user.password);
    const newUser = await this.userService.create(user);
    const { roleId, password, ...result } = newUser['dataValues'];
    const token = await this.generateToken(result);
    return { result, token };
  }

  async login(user) {
    const { role, permissions, ...result } = user;
    const token = await this.generateToken(result);
    return { user, token };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return req.user;
  }

  private async generateToken(data) {
    return await this.jwtService.signAsync(data);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(enteredPass: string, dbPass: string) {
    return await bcrypt.compare(enteredPass, dbPass);
  }
}
