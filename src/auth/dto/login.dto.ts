import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @MaxLength(120)
    @MinLength(3)
    @IsString()
    @IsNotEmpty()
    identity : string;
    
    @IsStrongPassword()
    @MaxLength(120)
    @MinLength(3)
    @IsString()
    @IsNotEmpty()
    password : string;
}