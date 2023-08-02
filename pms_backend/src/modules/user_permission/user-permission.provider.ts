import { USER_PERMISSION_REPOSITORY } from 'src/constant';
import { User_Permission } from './entities/user-permission.entity';
export const userPermissionProvider = [
  {
    provide: USER_PERMISSION_REPOSITORY,
    useValue: User_Permission,
  },
];
