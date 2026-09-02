import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  mail: string;

  @IsString()
  @MinLength(4)
  password: string;
}
