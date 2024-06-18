import { Schema, Prop } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema()
export abstract class AbstractEntity {
    @Prop({required : true, type : SchemaTypes.ObjectId})
    _id : Types.ObjectId;
}