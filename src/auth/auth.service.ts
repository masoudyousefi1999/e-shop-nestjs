import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/singup.dto';
import { Request, Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/user-role.enum';
import { compare } from 'bcryptjs';
import { setCookie } from 'src/common/setcookie';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  // one month time in miliSecend for Jwt
  private readonly oneMonth: number = 1000 * 60 * 60 * 24 * 30;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, res: Response, req: Request): Promise<void> {
    const { identity, password } = loginDto;
    const user = await this.userService.findUserByOrFilterQuery(
      [{ username: identity }, { email: identity }],
      '+password',
    );
    if (user && (await compare(password, user.password))) {
      const accessToken = this.jwtService.sign(
        { id: user._id },
        { secret: this.configService.getOrThrow<string>('JWT_SECRET') },
      );
      setCookie(res, accessToken, false, 'access_token');
      const refreshToken = this.jwtService.sign(
        { id: user._id },
        { secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET') },
      );
      user.token = refreshToken;
      await this.userService.updateUser(user._id, { token: refreshToken });
      setCookie(
        res,
        refreshToken,
        true,
        'refresh_token',
        '/auth/login/refreshtoken',
        this.oneMonth,
      );
      return;
    }
    throw new UnauthorizedException('username or password is wrong');
  }

  async singup(singupDto: SignupDto, res: Response): Promise<void> {
    const usercount = await this.userService.checkUserDocumentLength();
    let user = await this.userService.createUser(singupDto);
    user._id = new Types.ObjectId();
    // checking if users count is 0 and it first user is gonna be admin
    let role: Role;
    if (usercount === 0) {
      role = Role.ADMIN;
    } else {
      role = Role.USER;
    }
    const token = this.jwtService.sign(
      { id: user._id },
      { secret: this.configService.getOrThrow<string>('JWT_SECRET') },
    );
    setCookie(res, token, false, 'access_token');
    const refreshToken = this.jwtService.sign(
      { id: user._id },
      { secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET') },
    );
    user.role = role;
    user.token = refreshToken;
    await user.save();
    setCookie(
      res,
      refreshToken,
      true,
      'refresh_token',
      '/auth/login/refreshtoken',
      this.oneMonth,
    );
    return;
  }
}
