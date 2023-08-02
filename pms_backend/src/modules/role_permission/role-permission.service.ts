import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_PERMISSION_REPOSITORY } from 'src/constant';
import { RolePermissionInterface } from 'src/interface';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';
import { Role_Permission } from './entities/role-permission.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @Inject(ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: typeof Role_Permission,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  async AddPermissionToRole(data: RolePermissionInterface) {
    await this.rolePermissionRepository.destroy({
      where: { roleId: data.roleId },
    });
    if (!(await this.roleService.findOne(data.roleId)))
      throw new NotFoundException('This Role Not Found !!');
    const bulkData = data.permissions.map((item) => {
      return { roleId: data.roleId, permissionId: item.id };
    });

    return await this.rolePermissionRepository.bulkCreate<Role_Permission>(
      bulkData,
    );
  }

  async removeProductToCategory(
    permissionId: number,
    roleId: number,
  ): Promise<number> {
    return await this.rolePermissionRepository.destroy({
      where: {
        roleId,
        permissionId,
      },
    });
  }
}
