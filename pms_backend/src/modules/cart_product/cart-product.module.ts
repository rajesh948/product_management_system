import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { CartProductController } from './cart-product.controller';
import { cartProductProvider } from './cart-product.provider';
import { CartProductService } from './cart-product.service';

@Module({
  imports: [CartModule, ProductModule],
  providers: [CartProductService, ...cartProductProvider],
  controllers: [CartProductController],
  exports: [],
})
export class CartProductModule {}
