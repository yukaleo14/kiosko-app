import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  precio: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
