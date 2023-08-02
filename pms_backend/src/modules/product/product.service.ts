import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from 'src/constant';
import { QueryStringInterface } from 'src/interface';
import {
  getPagination,
  getSearchField,
  getSearchQuery,
  sortingOrder,
} from 'src/util/helper/common.helper';
import { ProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: typeof Product,
  ) {}

  async create(product: ProductDto): Promise<Product> {
    return await this.productRepository.create<Product>(product);
  }

  async findAll(query: QueryStringInterface) {
    const allowField = ['name', 'price', 'description', 'quantity'];
    const whereCondition = getSearchField(allowField, query.search || '');
    const sorting = sortingOrder(query.sort || undefined, allowField);
    const pagination = getPagination(+query.page || 1, +query.limit || 10);
    const multipleSearching = getSearchQuery(allowField, query.where || '');

    const { count, rows } = await this.productRepository.findAndCountAll({
      where: {
        ...whereCondition,
        ...multipleSearching,
      },
      order: sorting,
      limit: pagination.limit,
      offset: pagination.offset,
    });
    pagination.count = count;
    return { data: rows, pagination: pagination };
    // return { data: rows };
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findByPk(id);
  }

  async update(id: number, updateProduct: ProductDto) {
    const product = await this.findOne(id);
    if (!product) return null;
    return await product.update(updateProduct);
  }
  async delete(id: number): Promise<number> {
    return this.productRepository.destroy({ where: { id } });
  }
}
