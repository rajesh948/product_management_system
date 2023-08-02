import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_PERMISSION_REPOSITORY } from 'src/constant';
import { UserPermissionInterface } from 'src/interface';
import { PermissionService } from '../permission/permission.service';
import { UserService } from '../user/user.service';
import { User_Permission } from './entities/user-permission.entity';

@Injectable()
export class UserPermissionService {
  constructor(
    @Inject(USER_PERMISSION_REPOSITORY)
    private readonly userPermissionRepository: typeof User_Permission,
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
  ) {}

  async AddPermissionToUser(data: UserPermissionInterface) {
    await this.userPermissionRepository.destroy({
      where: { userId: data.userId },
    });
    if (!(await this.userService.findByPk(data.userId)))
      throw new NotFoundException('This User Not Found !!');
    const bulkData = data.permissions.map((item) => {
      return { userId: data.userId, permissionId: item.id };
    });

    return await this.userPermissionRepository.bulkCreate<User_Permission>(
      bulkData,
    );
  }

  async removePermissionFromUser(
    permissionId: number,
    userId: number,
  ): Promise<number> {
    return await this.userPermissionRepository.destroy({
      where: {
        userId,
        permissionId,
      },
    });
  }
}
