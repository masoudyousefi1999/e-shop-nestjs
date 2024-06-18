import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateNotEmptyPipe } from '../common/pipes/update-not-empty-input-check.pipe';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Get('getall')
  async getAllUsers(): Promise<User[]> {
    console.log("runnig")
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') _id: Types.ObjectId): Promise<User> {
    return this.userService.findOneUser(_id);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: Types.ObjectId): Promise<User> {
    return this.userService.removeUser(id);
  }

  @Patch('/:id')
  async updateUserInfo(
    @Param('id') _id: Types.ObjectId,
    @Body('', new UpdateNotEmptyPipe()) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(_id, updateUserDto);
  }
}
