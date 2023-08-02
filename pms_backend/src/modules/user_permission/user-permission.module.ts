import { Module } from '@nestjs/common';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
import { UserPermissionController } from './user-permission.controller';
import { userPermissionProvider } from './user-permission.provider';
import { UserPermissionService } from './user-permission.service';

@Module({
  imports: [PermissionModule, UserModule],
  providers: [UserPermissionService, ...userPermissionProvider],
  controllers: [UserPermissionController],
  exports: [],
})
export class UserPermissionModule {}
