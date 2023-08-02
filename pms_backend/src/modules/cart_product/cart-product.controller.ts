import {
  Request,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartProductService } from './cart-product.service';

@Controller('product-cart')
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @Post('/add/:id')
  @UseGuards(AuthGuard('jwt'))
  addProductToCart(
    @Param('id', ParseIntPipe) productId: number,
    @Request() req,
  ) {
    return this.cartProductService.addProductToCart(productId, req.user);
  }

  @Post('/remove/:id')
  @UseGuards(AuthGuard('jwt'))
  async removeProductFromCart(
    @Param('id', ParseIntPipe) productId: number,
    @Request() req,
  ) {
    const result = await this.cartProductService.removeProductFromCart(
      productId,
      req.user.cart.id,
    );
    if (!result) throw new NotFoundException('Category or Product Not Found !');
    return { message: 'Delete Successfully !' };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getMyCartProduct(@Request() req) {
    if (!req.user.cart) {
      return [];
    }

    return this.cartProductService.getCartProducts(req.user.cart.id);
  }
}
