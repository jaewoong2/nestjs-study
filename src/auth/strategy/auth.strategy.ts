import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

export interface UserToken {
  id: number;
  username: string;
  email: string;
  // 토큰이 발급된 시간 (issued at)
  iat: number;
  // 토큰의 만료시간 (expiraton)
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: UserToken) {
    const isValidate = await this.authService.isValidateToken(payload);

    if (!isValidate) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
