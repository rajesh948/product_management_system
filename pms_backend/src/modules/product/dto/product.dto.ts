import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsNumberString()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  image: string;
}
