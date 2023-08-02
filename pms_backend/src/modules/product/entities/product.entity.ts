import { DataTypes } from 'sequelize';
import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Cart_Product } from 'src/modules/cart_product/entities/cart-product.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Category_Product } from 'src/modules/category_product/entities/category-product.entity';

@Table
export class Product extends Model<Product> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  image: string;

  @BelongsToMany(() => Category, {
    through: () => Category_Product,
    foreignKey: 'productId',
  })
  categories: Category[];

  @BelongsToMany(() => Cart, {
    through: () => Cart_Product,
    foreignKey: 'productId',
  })
  carts: Cart[];
}
