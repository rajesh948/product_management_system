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
import { RolePermissionInterface } from 'src/interface';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('assign')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.ASSIGN_PERMISSION_ROLE),
  )
  async assignPermissionToRole(
    @Body() rolePermissionData: RolePermissionInterface,
  ) {
    await this.rolePermissionService.AddPermissionToRole(rolePermissionData);
    return { message: 'Permission Assign Successfully !' };
  }
  @Post('remove')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.REMOVE_PERMISSION_ROLE),
  )
  async removePermissionToRole(@Body() permissions: any, @Request() req) {
    const result = await this.rolePermissionService.removeProductToCategory(
      permissions.id,
      req.user.roleId,
    );
    if (!result) throw new NotFoundException('Something went wrong !');

    return { message: 'Permission remove Successfully !' };
  }
}
