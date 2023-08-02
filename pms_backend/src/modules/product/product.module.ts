import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { productProvider } from './product.provider';
import { ProductService } from './product.service';

@Module({
  imports: [],
  providers: [ProductService, ...productProvider],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
