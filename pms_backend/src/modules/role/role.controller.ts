import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
import { RoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), new permissionGuard(ASSIGN_PERMISSION.ROLE.ADD))
  addRole(@Body() roleData: RoleDto) {
    return this.roleService.create(roleData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new permissionGuard(ASSIGN_PERMISSION.ROLE.SHOW))
  getAllRoll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), new permissionGuard(ASSIGN_PERMISSION.ROLE.SHOW))
  GetOneRolePermissions(@Param('id', ParseIntPipe) roleId: number) {
    return this.roleService.findOne(roleId);
  }

  @Put(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.ROLE.UPDATE),
  )
  async updateRole(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() roleData: RoleDto,
  ) {
    const result = await this.roleService.update(roleId, roleData);
    if (!result) throw new NotFoundException('Role Not Found !');
    return { message: 'Role Update Successfully !', result };
  }

  @Delete(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.ROLE.DELETE),
  )
  async deleteRole(@Param('id', ParseIntPipe) roleId: number) {
    const result = await this.roleService.delete(roleId);
    if (!result) throw new NotFoundException('Role Not Found !');
    return { message: 'Role Delete Successfully !' };
  }
}
