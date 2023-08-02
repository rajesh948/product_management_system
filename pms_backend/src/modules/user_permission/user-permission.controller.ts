import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
import { UserPermissionInterface } from 'src/interface';
import { UserPermissionService } from './user-permission.service';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @Post('assign')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.ASSIGN_PERMISSION_USER),
  )
  async assignPermissionToUser(
    @Body() userPermissionData: UserPermissionInterface,
  ) {
    await this.userPermissionService.AddPermissionToUser(userPermissionData);
    return { message: 'Permission Assign Successfully !' };
  }

  @Post('remove')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.REMOVE_PERMISSION_USER),
  )
  async removePermissionFromUser(@Body() permissions: any, @Request() req) {
    const result = await this.userPermissionService.removePermissionFromUser(
      permissions.id,
      req.user.userId,
    );
    if (!result) throw new NotFoundException('Something went wrong !');

    return { message: 'Permission remove Successfully !' };
  }
}
