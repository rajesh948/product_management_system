import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/modules/category/entities/category.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Table
export class Category_Product extends Model<Category_Product> {
  @ForeignKey(() => Category)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Category)
  category: Category;
}
