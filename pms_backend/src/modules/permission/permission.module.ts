import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { PermissionController } from './permission.controller';
import { permissionProvider } from './permission.provider';
import { PermissionService } from './permission.service';

@Module({
  imports: [RoleModule],
  providers: [PermissionService, ...permissionProvider],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
