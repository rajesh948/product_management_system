import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { CategoryProductController } from './category-product.controller';
import { catProductProvider } from './category-product.provider';
import { CategoryProductService } from './category-product.service';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [CategoryProductService, ...catProductProvider],
  controllers: [CategoryProductController],
  exports: [],
})
export class CategoryProductModule {}
