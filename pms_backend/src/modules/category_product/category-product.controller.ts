import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
import { CategoryProductInterface, QueryStringInterface } from 'src/interface';
import { CategoryProductService } from './category-product.service';
import { CatProductDto } from './dto/category-product.dto';

@Controller('product-category')
export class CategoryProductController {
  constructor(private readonly CatProductService: CategoryProductService) {}

  @Post('add')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.ADD_PRODUCT_CATEGORY),
  )
  addProductToCategory(@Body() catProductData: CategoryProductInterface) {
    return this.CatProductService.addProductToCategory(catProductData);
  }

  @Post('remove')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.REMOVE_PRODUCT_CATEGORY),
  )
  async removeProductToCategory(@Body() catProductData: CatProductDto) {
    const result = await this.CatProductService.removeProductToCategory(
      catProductData.productId,
      catProductData.categoryId,
    );
    if (!result) throw new NotFoundException('Category or Product Not Found !');
    return { message: 'Delete Successfully !' };
  }

  @Get(':id')
  getOneCategoryWithProduct(
    @Param('id', ParseIntPipe) categoryId: number,
    @Query() query: QueryStringInterface,
  ) {
    return this.CatProductService.findOneWithProduct(categoryId, query);
  }
}
