import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVERSECRET,
      callbackURL: process.env.NAVER_CALL_BACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile.email,
      pw: '1111',
      nickname: profile.id,
      phone: '1111',
    };
  }
}
