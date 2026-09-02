import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  mail: string;

  @IsString()
  nombreLocal: string;

  @IsString()
  @MinLength(4)
  password: string;
}