import {
  CanActivate,
  ExecutionContext,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { setCookie } from 'src/common/setcookie';
import { UserService } from 'src/user/user.service';
import { extractJwt } from '../header-jwt-extractor';

export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    console.log(jwtService);
  }

  isValidToken(token) {
    const vrefiedToken = this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
    if(!vrefiedToken){
      throw new UnauthorizedException("your token is not valid")
    }

    return vrefiedToken
  }

  getUserToken(req: Request) {
    if (req.cookies.refresh_token) {
      return req.cookies.refresh_token;
    } else if (req.headers.authorization) {
      const token = extractJwt(req.headers.authorization);
      if (token) {
        return token;
      }
    }

    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    // #TODO => save refresh token for each device sepratly
    // console.log(req.rawHeaders.find((value) => console.log(value)))
    let userToken = this.getUserToken(req);
    try {
      if (!userToken) {
        return false;
      }

      const tokenIsValid = this.isValidToken(userToken);
      if (!(tokenIsValid && isValidObjectId(tokenIsValid.id))) {
        throw new UnauthorizedException('you are not login please login.');
      }
      const user = await this.userService.findOneUser({
        _id: tokenIsValid.id,
      } as any);

      const isValidRefreshToken = user.token === userToken;
      if (!isValidRefreshToken) {
        throw new UnauthorizedException('you are not login please login.');
      }
      const token = this.jwtService.sign(
        { id: user._id },
        { secret: this.configService.getOrThrow<string>('JWT_SECRET') },
      );
      setCookie(res, token, true, 'access_token', '/');
      return true;
    } catch (error) {
      // if user not found this internal expection call.
      if (error instanceof InternalServerErrorException) {
        throw new UnauthorizedException(
          'this token is not valid any more please login.',
        );
      }

      throw new UnauthorizedException();
    }
  }
}
