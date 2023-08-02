import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Table
export class Cart_Product extends Model<Cart_Product> {
  @ForeignKey(() => Cart)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  cartId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 1,
  })
  quantity: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Cart)
  cart: Cart;
}
