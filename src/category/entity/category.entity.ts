import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

export type CategoryDocument = mongoose.HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category extends AbstractEntity {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: false })
  image?: string;

  createdAt: string;
  updatedAt: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
