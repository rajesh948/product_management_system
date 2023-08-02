import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';

import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // @Post()
  // addPermission(@Body() permissionData: PermissionDto) {
  //   return this.permissionService.create(permissionData);
  // }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllPermission() {
    return this.permissionService.findAll();
  }

  // @Put(':id')
  // async updatePermission(
  //   @Param('id', ParseIntPipe) permissionId: number,
  //   @Body() permissionData: PermissionDto,
  // ) {
  //   const result = await this.permissionService.update(
  //     permissionId,
  //     permissionData,
  //   );
  //   if (!result) throw new NotFoundException('Permission Not Found !');
  //   return { message: 'Permission Update Successfully !', result };
  // }

  //   @Delete(':id')
  //   async deletePermission(@Param('id', ParseIntPipe) permissionId: number) {
  //     const result = await this.permissionService.delete(permissionId);
  //     if (!result) throw new NotFoundException('Permission Not Found !');
  //     return { message: 'Permission Delete Successfully !' };
  //   }
}
