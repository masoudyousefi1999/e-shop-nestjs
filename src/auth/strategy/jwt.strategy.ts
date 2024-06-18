import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { extractJwt } from '../header-jwt-extractor';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req?.cookies?.token) {
            return req.cookies.access_token;
          } else if (req.headers?.authorization) {
            return extractJwt(req.headers.authorization);
          }

          throw new UnauthorizedException('you are not auhtoraized');
        },
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      ignoerExpireation: false,
    });
  }

  async validate(paylod: { id: Types.ObjectId }) {
    try {
      const user = await this.userService.findOneUser(paylod.id);
      return user;
    } catch (error) {
      throw new NotFoundException('user not found please login correctly');
    }
  }
}
