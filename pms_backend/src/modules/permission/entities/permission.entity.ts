import { DataTypes } from 'sequelize';
import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/modules/role/entities/role.entity';
import { Role_Permission } from 'src/modules/role_permission/entities/role-permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { User_Permission } from 'src/modules/user_permission/entities/user-permission.entity';

@Table
export class Permission extends Model<Permission> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  title: string;

  @BelongsToMany(() => Role, {
    through: () => Role_Permission,
    foreignKey: 'permissionId',
  })
  roles: Role[];

  @BelongsToMany(() => User, {
    through: () => User_Permission,
    foreignKey: 'permissionId',
  })
  users: User[];
}
