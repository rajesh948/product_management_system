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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
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
