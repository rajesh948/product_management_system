import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
import { CustomFileInterceptor } from 'src/interceptor/file.interceptor';
import { QueryStringInterface } from 'src/interface';
import { ProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.PRODUCT.ADD),
  )
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './src/upload',
        filename(req, file, callback) {
          callback(
            null,
            `${
              Math.random().toString(23).slice(2) +
              '-product-' +
              file.mimetype.replace('/', '.')
            }`,
          );
        },
      }),
    }),
  )
  createProduct(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file,
    @Body() product: ProductDto,
  ) {
    product.image = file.filename;
    return this.productService.create(product);
  }

  @Get()
  getAllProduct(@Query() query: QueryStringInterface) {
    return this.productService.findAll(query);
  }

  @Put(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.PRODUCT.UPDATE),
  )
  @UseInterceptors(new CustomFileInterceptor())
  async updateProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProduct: Product,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file,
  ) {
    updateProduct.image = file.filename;
    const result = await this.productService.update(productId, updateProduct);
    if (!result) throw new NotFoundException('Product Not Found !');
    return { message: 'Product Update Successfully !', data: result };
  }

  @Delete(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.PRODUCT.DELETE),
  )
  @UseGuards(AuthGuard('jwt'))
  async deleteProduct(@Param('id', ParseIntPipe) productId: number) {
    const result = await this.productService.delete(productId);
    if (!result) throw new NotFoundException('Product Not Found !');
    return { message: 'Product Delete Successfully !' };
  }
}
