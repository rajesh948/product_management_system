import { Inject, Injectable } from '@nestjs/common';
import { PERMISSION_REPOSITORY } from 'src/constant';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: typeof Permission,
  ) {}

  async create(permission: PermissionDto): Promise<Permission> {
    return await this.permissionRepository.create<Permission>(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.findAll<Permission>({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async findOne(id: number): Promise<Permission> {
    return await this.permissionRepository.findByPk<Permission>(id);
  }

  async update(id: number, updatePermission: PermissionDto) {
    const editPermission = await this.permissionRepository.findByPk(id);
    if (!editPermission) return null;
    return await editPermission.update(updatePermission);
  }

  // async delete(id: number) {
  //   return await this.permissionRepository.destroy({ where: { id } });
  // }
}
