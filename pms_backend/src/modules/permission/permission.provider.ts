import { PERMISSION_REPOSITORY } from 'src/constant';
import { Permission } from './entities/permission.entity';

export const permissionProvider = [
  {
    provide: PERMISSION_REPOSITORY,
    useValue: Permission,
  },
];
