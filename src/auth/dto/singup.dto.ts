import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/user/user-role.enum';

export class SignupDto {
  @MaxLength(120)
  @MinLength(4)
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  @MaxLength(120)
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(11)
  @MinLength(11)
  @IsNotEmpty()
  phone: string;

  @IsEmpty({ message: 'role does not exsist but sended' })
  role?: Role;

  @IsEmpty({message : "field with name token is not exsist"})
  token? : string;

  createdAt: Date;
  updatedAt: Date;
}
