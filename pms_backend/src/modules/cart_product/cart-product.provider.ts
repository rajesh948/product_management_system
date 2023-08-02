import { CART_PRODUCT_REPOSITORY } from 'src/constant';
import { Cart_Product } from './entities/cart-product.entity';
export const cartProductProvider = [
  {
    provide: CART_PRODUCT_REPOSITORY,
    useValue: Cart_Product,
  },
];
