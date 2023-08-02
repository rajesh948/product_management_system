import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from 'src/constant';
import { Permission } from '../permission/entities/permission.entity';
import { RoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: typeof Role,
  ) {}

  async create(role: RoleDto): Promise<Role> {
    return await this.roleRepository.create<Role>(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.findAll<Role>({
      include: {
        model: Permission,
        attributes: { exclude: ['Role_Permission', 'createdAt', 'updatedAt'] },
      },
      attributes: { exclude: ['Role_Permission'] },
    });
  }

  async findOne(id: number): Promise<Role> {
    return await this.roleRepository.findByPk<Role>(id, {
      include: {
        model: Permission,
        attributes: { exclude: ['Role_Permission', 'createdAt', 'updatedAt'] },
      },
    });
  }

  async update(id: number, updateRole: RoleDto) {
    const editRole = await this.roleRepository.findByPk(id);

    if (!editRole) return null;
    return await editRole.update(updateRole);
  }

  async delete(id: number): Promise<number> {
    return await this.roleRepository.destroy({ where: { id } });
  }
}
