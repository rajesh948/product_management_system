import { CATEGORY_PRODUCT_REPOSITORY } from 'src/constant';
import { Category_Product } from './entities/category-product.entity';
export const catProductProvider = [
  {
    provide: CATEGORY_PRODUCT_REPOSITORY,
    useValue: Category_Product,
  },
];
