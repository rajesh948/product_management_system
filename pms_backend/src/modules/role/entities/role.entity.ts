import { DataTypes } from 'sequelize';
import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role_Permission } from 'src/modules/role_permission/entities/role-permission.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table
export class Role extends Model<Role> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  title: string;

  @HasMany(() => User)
  users: User[];

  @BelongsToMany(() => Permission, {
    through: () => Role_Permission,
    foreignKey: 'roleId',
  })
  permissions: Permission[];
}
