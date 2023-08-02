import { DataTypes } from 'sequelize';
import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Category_Product } from 'src/modules/category_product/entities/category-product.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Table
export class Category extends Model<Category> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Product, {
    through: () => Category_Product,
    foreignKey: 'categoryId',
  })
  products: Product[];
}
