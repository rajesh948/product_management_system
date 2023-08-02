import { ROLE_PERMISSION_REPOSITORY } from 'src/constant';
import { Role_Permission } from './entities/role-permission.entity';
export const rolePermissionProvider = [
  {
    provide: ROLE_PERMISSION_REPOSITORY,
    useValue: Role_Permission,
  },
];
