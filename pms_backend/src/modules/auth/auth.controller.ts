import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from 'src/guards/doesUserExist.guard';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(DoesUserExist)
  @Post('register')
  register(@Body() user: UserDto) {
    return this.authService.create(user);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Get('get-user-data')
  @UseGuards(AuthGuard('jwt'))
  getUserData(@Request() req) {
    return this.authService.getLoginUserData(req.user.email);
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {
  //   console.log('');
  // }

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Request() req) {
  //   return this.authService.googleLogin(req);
  // }
}
