import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: process.env.KAKAO_CALL_BACK_URL,
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile._json.kakao_account.email,
      pw: '1111',
      nickname: profile.id,
      phone: '1111',
    };
  }
}
