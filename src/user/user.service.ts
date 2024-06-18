import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';
import { FilterQuery, QuerySelector, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './user-role.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllDocuments();
  }

  async findOneUser(
    _id: Types.ObjectId,
    select?: QuerySelector<User>,
  ): Promise<User> {
    if (select) {
      return this.userRepository.findOneDocument(_id, select);
    }
    return this.userRepository.findOneDocument(_id);
  }

  async removeUser(_id: Types.ObjectId): Promise<User> {
    return this.userRepository.deleteDocument(_id);
  }

  async updateUser(
    _id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userRepository.updateDocument(_id, updateUserDto);
  }

  async findUserByOrFilterQuery(
    filterQuery: Array<FilterQuery<User>>,select? : string
  ): Promise<User> {
    return this.userRepository.findWithOrQuery(filterQuery,select as unknown);
  }

  async createUser(user: Omit<User, '_id'>) {
    return this.userRepository.createNewUser(user);
  }

  async checkUserDocumentLength() : Promise<number>{
    return this.userRepository.checkUsersDocumentLength();
  }
}
