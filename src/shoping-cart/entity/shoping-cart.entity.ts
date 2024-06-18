import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

export interface ICartProducts extends AbstractEntity{
  product: Types.ObjectId;
  count: number;
  price : number
}

@Schema({ versionKey: false, timestamps: true })
export class ShoppingCart extends AbstractEntity {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, required: true },
        count: { type: Number, required: true },
        price : {type : Number, required : true}
      },
    ],
  })
  items: ICartProducts[];

  @Prop({ type: Boolean, required: true, default: 0 })
  isPaid: boolean;

  @Prop({ type: Number, required: true, default: 0 })
  totalPrice: number;
}

export const ShoppingCartSchema = SchemaFactory.createForClass(ShoppingCart);
