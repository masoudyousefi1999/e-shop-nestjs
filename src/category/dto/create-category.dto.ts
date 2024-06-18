import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @MaxLength(100)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsOptional()
  image?: string;
  createdAt: string;
  updatedAt: string;
}
