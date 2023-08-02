import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@Table({ timestamps: false })
export class Role_Permission extends Model<Role_Permission> {
  @ForeignKey(() => Role)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  roleId: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  permissionId: number;
}
