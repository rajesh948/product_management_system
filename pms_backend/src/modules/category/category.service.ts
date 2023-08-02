import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from 'src/constant';
import { CategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: typeof Category,
  ) {}

  async create(category: CategoryDto): Promise<Category> {
    return this.categoryRepository.create<Category>(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }
  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findByPk(id);
  }

  async update(id: number, updateCategory: CategoryDto) {
    const category = await this.categoryRepository.findByPk(id);

    if (!category) return null;
    return await category.update(updateCategory);
  }

  async delete(id: number): Promise<number> {
    return await this.categoryRepository.destroy({ where: { id } });
  }
}
