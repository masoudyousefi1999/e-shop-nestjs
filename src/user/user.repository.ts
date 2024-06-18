import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { User } from './entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from 'src/auth/dto/singup.dto';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(@InjectModel(User.name) protected userModel: Model<User>) {
    super(userModel);
  }

  async checkUsersDocumentLength(){
    return await this.userModel.countDocuments()
  }

  async createNewUser(singupDto : SignupDto){
    return new this.userModel(singupDto)
  }
}
