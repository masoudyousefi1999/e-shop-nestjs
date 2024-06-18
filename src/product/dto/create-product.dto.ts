import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { Category } from 'src/category/entity/category.entity';

export class CreateProductDto {
  @MaxLength(150)
  @MinLength(2)
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price: number;

  @MinLength(10)
  @IsNotEmpty()
  description: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  // @Transform(({ value }) => typeof value === "string" ? Array.from(value.split(',')) : value)
  category: Category[];
  
  image: string;

  createdAt: Date;
  updatedAt: Date;
}
