import { Types, isValidObjectId } from 'mongoose';
import { ICartProducts } from '../entity/shoping-cart.entity';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class AddToCartDto {
  @IsEmpty({ message: 'not such a field exsist' })
  userId: Types.ObjectId;

  @Transform(({ value }: { value: ICartProducts }) => {
    if (!(value.count || value.product) || value.count <= 0) {
      throw new BadRequestException(
        'product field must be object with product and count bigger than 0 propertys please send correct format',
      );
    }
    if (!isValidObjectId(value.product)) {
      throw new BadRequestException('product object id is not valid');
    }
    return value;
  })
  @IsNotEmpty()
  items: ICartProducts;
  @IsEmpty()
  isPaid: boolean;
  @IsEmpty()
  totalPrice: number;
}
