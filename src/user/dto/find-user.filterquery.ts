import { Types } from "mongoose";

export class UserFilterQuery {
    _id? : Types.ObjectId;
    username? : string;
    email? : string;
    phone? : string;
}