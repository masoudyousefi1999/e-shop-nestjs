import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaType, Types } from 'mongoose';
import { Category } from 'src/category/entity/category.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';

export type productDocument = mongoose.HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product extends AbstractEntity {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true, type: Types.ObjectId, ref : Category.name })
  category: Category[];
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
