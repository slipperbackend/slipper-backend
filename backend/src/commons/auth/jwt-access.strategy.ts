import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class JWtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cachManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.LOGIN_ACCESS_TOKEN,
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    const AccessToken = req.headers.authorization.replace('Bearer ', '');
    const redisAccessToken = await this.cachManager.get(AccessToken);
    if (redisAccessToken) throw new UnauthorizedException();
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  }
}
