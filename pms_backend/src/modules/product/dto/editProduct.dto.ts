import { IsNumberString, IsString } from 'class-validator';

export class EditProductDto {
  @IsString()
  name: string;

  @IsNumberString()
  price: number;

  @IsNumberString()
  quantity: number;

  @IsString()
  description: string;

  image: string;
}
