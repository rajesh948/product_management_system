import { CART_REPOSITORY } from 'src/constant';
import { Cart } from './entities/cart.entity';

export const cartProvider = [
  {
    provide: CART_REPOSITORY,
    useValue: Cart,
  },
];
