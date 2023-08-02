import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cart_Product } from 'src/modules/cart_product/entities/cart-product.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table
export class Cart extends Model<Cart> {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataTypes.INTEGER,
  })
  totalPrice: number;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isCheckout: boolean;

  @BelongsToMany(() => Product, {
    through: () => Cart_Product,
    foreignKey: 'cartId',
  })
  products: Product[];

  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;
}
