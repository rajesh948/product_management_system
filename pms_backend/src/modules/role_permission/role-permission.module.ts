import { Module } from '@nestjs/common';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { RolePermissionController } from './role-permission.controller';
import { rolePermissionProvider } from './role-permission.provider';
import { RolePermissionService } from './role-permission.service';

@Module({
  imports: [PermissionModule, RoleModule],
  providers: [RolePermissionService, ...rolePermissionProvider],
  controllers: [RolePermissionController],
  exports: [],
})
export class RolePermissionModule {}
