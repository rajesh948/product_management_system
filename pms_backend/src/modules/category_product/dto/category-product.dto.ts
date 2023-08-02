import { IsNotEmpty, IsNumber } from 'class-validator';

export class CatProductDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
