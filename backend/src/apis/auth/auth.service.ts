import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JoinService } from '../join/join.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly joinservice: JoinService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtservice.sign(
      { email: user.email, sub: user.id, role: user.role },
      { secret: process.env.LOGIN_ACCESS_TOKEN, expiresIn: '1h' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtservice.sign(
      { email: user.email, sub: user.id, role: user.role },
      { secret: process.env.LOGIN_REFRESH_TOKEN, expiresIn: '25h' },
    );
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    // 배포환경
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader(
    //   'Set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain=.backend.slipperofficial.shop; SameSite=None; Secure; httpOnly;`,
    // );

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.backend.slipperofficial.shop; Secure; httpOnly; SameSite=None;`,
    );
  }

  async login({ req, res }) {
    let user = await this.joinservice.findOne({ email: req.user.email });
    if (!user) {
      user = await this.joinservice.createSocial({
        email: req.user.email,
        pw: req.user.pw,
        phone: req.user.phone,
        nickname: req.user.nickname,
      });
    }

    this.setRefreshToken({ user, res });

    res.redirect('http://localhost:3000/mypage');
  }
}
