import { Module } from '@nestjs/common';
import { cartProvider } from './cart.provider';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [],
  providers: [CartService, ...cartProvider],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
