import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { roleProvider } from './role.provider';
import { RoleService } from './role.service';

@Module({
  imports: [],
  providers: [RoleService, ...roleProvider],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
