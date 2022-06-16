import {
  UnprocessableEntityException,
  UseGuards,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JoinService } from '../join/join.service';
import { AuthService } from './auth.service';
// import * as bcrypt from 'bcrypt';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly joinservice: JoinService,
    private readonly authservice: AuthService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('pw') pw: string,
    @Context() context: any,
  ) {
    const user = await this.joinservice.findOne({ email });

    if (!user) throw new UnprocessableEntityException('이메일을 확인하세요.');
    const isAuthPw = await bcrypt.compare(pw, user.pw);
    if (!isAuthPw)
      throw new UnprocessableEntityException('비밀번호를 확인해주세요.');
    this.authservice.setRefreshToken({ user, res: context.res });

    return this.authservice.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.authservice.getAccessToken({ user: currentUser });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: any, //
  ) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    ); //엑세스 토큰값을 가져온다.
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    try {
      jwt.verify(accessToken, process.env.LOGIN_ACCESS_TOKEN);
      jwt.verify(refreshToken, process.env.LOGIN_REFRESH_TOKEN);
    } catch {
      throw new UnprocessableEntityException();
    }
    const res = context.res;
    await this.cacheManager.set(accessToken, 'accessToken', { ttl: 120 });
    await this.cacheManager.set(refreshToken, 'refreshToken', { ttl: 120 });
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${'0'}; path=/; domain=.backend.slipperofficial.shop; Secure; httpOnly; SameSite=None;`,
    );
    return '로그아웃 성공!!';
  }
}
