import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ASSIGN_PERMISSION } from 'src/constant';
import { permissionGuard } from 'src/guards/permission.guard';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.CATEGORY.ADD),
  )
  createCategory(@Body() category: CategoryDto) {
    return this.categoryService.create(category);
  }

  @Get()
  getAllCategory() {
    return this.categoryService.findAll();
  }

  @Put(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.CATEGORY.UPDATE),
  )
  async updateCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategory: CategoryDto,
  ) {
    const result = await this.categoryService.update(
      categoryId,
      updateCategory,
    );
    if (!result) throw new NotFoundException('Category Not Found !');
    return { message: 'Category Update Successfully !', data: result };
  }

  @Delete(':id')
  @UseGuards(
    AuthGuard('jwt'),
    new permissionGuard(ASSIGN_PERMISSION.CATEGORY.DELETE),
  )
  async deleteCategory(@Param('id', ParseIntPipe) categoryId: number) {
    const result = await this.categoryService.delete(categoryId);
    if (!result) throw new NotFoundException('Category Not Found !');
    return { message: 'Category Delete Successfully !' };
  }
}
