import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class UserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  // @IsNumberString()
  // @Length(10, 10, {
  //   message: 'Contact Number Must Be 10 Digit !',
  // })
  contact: string;

  // @IsEnum(Gender, {
  //   message: 'Gender Must Be Male,Female or Other !',
  // })
  gender: Gender;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @IsDateString()
  birthDate: Date;

  city: string;

  address: string;

  @IsNotEmpty()
  password: string;
}
