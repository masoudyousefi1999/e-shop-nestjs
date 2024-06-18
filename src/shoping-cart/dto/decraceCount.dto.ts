import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class DecreaseCountDto {
    @IsString()
    @IsNotEmpty()
    productId : Types.ObjectId
}