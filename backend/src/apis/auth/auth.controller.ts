import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Join } from '../join/entities/join.entity';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: Pick<Join, 'email' | 'pw' | 'nickname' | 'phone'>;
}
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.login({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.login({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.login({ req, res });
  }
}
