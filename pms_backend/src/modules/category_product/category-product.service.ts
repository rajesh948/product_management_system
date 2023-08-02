import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_PRODUCT_REPOSITORY } from 'src/constant';
import { CategoryProductInterface, QueryStringInterface } from 'src/interface';
import {
  getPagination,
  getSearchField,
  getSearchQuery,
  sortingOrder,
} from 'src/util/helper/common.helper';
import { CategoryService } from '../category/category.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Category_Product } from './entities/category-product.entity';

@Injectable()
export class CategoryProductService {
  constructor(
    @Inject(CATEGORY_PRODUCT_REPOSITORY)
    private readonly catProductRepository: typeof Category_Product,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  async addProductToCategory(
    data: CategoryProductInterface,
  ): Promise<Category_Product[]> {
    await this.catProductRepository.destroy({
      where: { categoryId: data.categoryId },
    });
    if (!(await this.categoryService.findOne(data.categoryId)))
      throw new NotFoundException('Category Not Found !');
    const bulkData = data.products.map((product) => {
      return { categoryId: data.categoryId, productId: product.id };
    });

    return await this.catProductRepository.bulkCreate<Category_Product>(
      bulkData,
    );
  }

  async removeProductToCategory(
    productId: number,
    categoryId: number,
  ): Promise<number> {
    return await this.catProductRepository.destroy({
      where: {
        productId,
        categoryId,
      },
    });
  }

  async findOneWithProduct(categoryId: number, query: QueryStringInterface) {
    const allowField = [
      'product.name',
      'product.price',
      'product.description',
      'product.quantity',
      'product.image',
    ];
    const whereCondition = getSearchField(allowField, query.search || '');
    const sorting = sortingOrder(query.sort || undefined, allowField);
    const pagination = getPagination(+query.page || 1, +query.limit || 10);
    const multipleSearching = getSearchQuery(allowField, query.where || '');

    const { count, rows } = await this.catProductRepository.findAndCountAll({
      where: {
        categoryId,
        ...whereCondition,
        ...multipleSearching,
      },
      include: [Product],
      order: sorting,
      limit: pagination.limit,
      offset: pagination.offset,
    });
    pagination.count = count;
    return { data: rows, pagination: pagination };
  }
}
