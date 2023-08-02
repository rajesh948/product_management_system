import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Put,
  ConflictException,
  GoneException,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
import { parseJSON } from 'src/util/helper/common.helper';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), new permissionGuard(ASSIGN_PERMISSION.USER.ADD))
  create(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('forgot')
  async forgotPassword(
    @Body() credential: { email: string; password: string; otp: number },
    @Req() req,
  ) {
    const sessionObj = Object.values(req.sessionStore.sessions)[0];

    if (typeof sessionObj === 'string' && parseJSON(sessionObj)) {
      if (!parseJSON(sessionObj)?.otp) {
        throw new GoneException('Please Resend OTP');
      }
      if (parseJSON(sessionObj).otp !== credential.otp) {
        throw new ConflictException('Otp not Match');
      }
    }

    const response = await this.userService.forgotPassword(credential);
    return response
      ? { message: 'password change successfully' }
      : { message: 'Email not Found' };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new permissionGuard(ASSIGN_PERMISSION.USER.SHOW))
  findAll() {
    return this.userService.findAll();
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: any) {
    const result = this.userService.update(id, updateUserDto);
    if (!result) throw new NotFoundException('User Not Found !');
    return { message: 'User Update Successfully !', result };
  }

  @Delete(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.USER.DELETE),
  )
  remove(@Param('id', ParseIntPipe) id: number) {
    const result = this.userService.delete(id);
    if (!result) throw new NotFoundException('User Not Found !');
    return { message: 'User Delete Successfully !' };
  }
}
