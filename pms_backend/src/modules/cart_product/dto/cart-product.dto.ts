import { IsNotEmpty, IsNumber } from 'class-validator';

export class CatProductDto {
  @IsNotEmpty()
  @IsNumber()
  cartId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
