import { IsNotEmpty } from 'class-validator';

export class RoleDto {
  @IsNotEmpty()
  title: string;
}
