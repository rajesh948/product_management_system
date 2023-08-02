import {
  Controller,
  Post,
  UseGuards,
  Request,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'))
  async checkoutProduct(@Request() req) {
    if (!req.user.cart.id) {
      throw new NotFoundException('please add product to cart !');
    }
    return this.cartService.checkOutCart(req.user.cart.id);
  }

  @Get('purchase-history')
  @UseGuards(AuthGuard('jwt'))
  async purchaseHistory(@Request() req) {
    return this.cartService.purchaseHistory(req.user.id);
  }
}
