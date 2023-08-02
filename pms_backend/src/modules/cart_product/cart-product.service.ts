import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CART_PRODUCT_REPOSITORY } from 'src/constant';
import { JwtSetUserInterface } from 'src/interface';

import { CartService } from '../cart/cart.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Cart_Product } from './entities/cart-product.entity';

@Injectable()
export class CartProductService {
  constructor(
    @Inject(CART_PRODUCT_REPOSITORY)
    private readonly cartProductRepository: typeof Cart_Product,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async addProductToCart(
    productId: number,
    user: JwtSetUserInterface,
  ): Promise<Cart_Product | string> {
    let cartId;
    if (!user.cart) {
      const cart = await this.cartService.create(user.id);
      cartId = cart.id;
    } else {
      cartId = user.cart.id;
    }
    const cart = await this.cartService.findOne(cartId);
    const product = await this.productService.findOne(productId);

    if (!product) throw new NotFoundException('Product Not Found !');
    if (!cart) throw new NotFoundException('Cart Not Found !');

    const checkProductExist =
      await this.cartProductRepository.findOne<Cart_Product>({
        where: { cartId, productId },
      });
    if (checkProductExist) {
      checkProductExist.quantity += 1;
      cart.totalPrice += product.price;
      cart.save();
      return checkProductExist.save();
    }

    cart.totalPrice += product.price;
    const cartTotalPrice = await cart.save();

    return await this.cartProductRepository.create<Cart_Product>({
      productId,
      cartId,
    });
  }
  async removeProductFromCart(
    productId: number,
    cartId: number,
  ): Promise<Cart_Product> {
    const cart = await this.cartService.findOne(cartId);
    const product = await this.productService.findOne(productId);

    const check = await this.cartProductRepository.findOne<Cart_Product>({
      where: { cartId, productId },
    });

    if (!check) throw new BadRequestException('product not found in cart !');
    if (check.quantity === 1) {
      cart.totalPrice -= product.price;
      cart.save();
      check.destroy();
      return check.save();
    }
    check.quantity -= 1;
    cart.totalPrice -= product.price;
    cart.save();
    return check.save();
  }

  async getCartProducts(cartId: number): Promise<Cart_Product[]> {
    return await this.cartProductRepository.findAll({
      where: { cartId },
      include: [Product],
    });
  }
}
