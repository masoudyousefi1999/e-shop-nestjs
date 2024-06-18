import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/singup.dto';
import { User } from 'src/user/entity/user.entity';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    return this.authService.login(loginDto, res, req);
  }

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.singup(signupDto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/login/refreshtoken')
  async refreshToken(@Req() req : Request) : Promise<void> {
    return;
  }
}
