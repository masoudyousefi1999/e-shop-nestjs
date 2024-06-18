import {
  IsEmpty,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @MaxLength(120)
  @MinLength(4)
  @IsOptional()
  username?: string;

  @IsStrongPassword()
  @MaxLength(120)
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEmpty()
  token? : string;
}
