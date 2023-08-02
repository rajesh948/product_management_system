import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({ timestamps: false })
export class User_Permission extends Model<User_Permission> {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  permissionId: number;
}
