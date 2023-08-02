import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtSetUserInterface } from 'src/interface';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }

    const cart = JSON.parse(JSON.stringify(user)).carts.filter(
      (cart) => !cart.isCheckout,
    );

    const userData: JwtSetUserInterface = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
      role: user.role.title,
      cart: cart[0],
      permissions: [
        ...JSON.parse(JSON.stringify(user)).role.permissions.map(
          (permission) => permission.title,
        ),
        ...JSON.parse(JSON.stringify(user)).permissions.map(
          (permission) => permission.title,
        ),
      ],
    };

    return userData;
  }
}
