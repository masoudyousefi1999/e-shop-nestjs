import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Role } from '../user-role.enum';
import mongoose, { Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { hash } from 'bcryptjs';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractEntity {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: false, default: Role.USER, enum: Role })
  role?: Role;

  @Prop({required : false})
  token? : string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.password = await hash(this.password, 12);
  }
  next();
});
