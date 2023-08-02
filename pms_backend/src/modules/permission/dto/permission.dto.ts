import { IsNotEmpty } from 'class-validator';

export class PermissionDto {
  @IsNotEmpty()
  title: string;
}
