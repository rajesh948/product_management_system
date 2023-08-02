import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CART_REPOSITORY } from 'src/constant';
import { Product } from '../product/entities/product.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: typeof Cart,
  ) {}

  async create(userId: number): Promise<Cart> {
    return this.cartRepository.create<Cart>({ userId });
  }

  async findOne(id: number): Promise<Cart> {
    return this.cartRepository.findByPk(id, { include: [Product] });
  }

  async checkOutCart(cartId: number) {
    const cart = await this.findOne(cartId);
    if (!cart) throw new UnauthorizedException('something went wrong !!');
    cart.isCheckout = true;
    cart.save();
    return { message: 'checkout successful !' };
  }

  async purchaseHistory(userId: number) {
    return this.cartRepository.findAll({
      where: { userId, isCheckout: true },
      include: {
        model: Product,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    });
  }
}
