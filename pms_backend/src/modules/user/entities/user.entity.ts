import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { User_Permission } from 'src/modules/user_permission/entities/user-permission.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataTypes.STRING,
  })
  contact: string;

  @Column({
    type: DataTypes.ENUM,
    values: ['male', 'female', 'other'],
  })
  gender: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataTypes.DATE,
  })
  birthDate: Date;

  @Column({
    type: DataTypes.STRING,
  })
  city: string;

  @Column({
    type: DataTypes.STRING,
  })
  address: string;

  @Column({
    type: DataTypes.STRING,
  })
  password: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;
  @HasMany(() => Cart)
  carts: Cart[];

  @BelongsToMany(() => Permission, {
    through: () => User_Permission,
    foreignKey: 'userId',
  })
  permissions: Permission[];
}
