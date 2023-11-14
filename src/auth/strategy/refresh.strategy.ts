import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  token: string | null = null;

  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          if (request && request.cookies && request.cookies.Refresh) {
            this.token = request.cookies.Refresh;
          }
          return this.token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: UserToken) {
    if (this.token) {
      await this.authService.isValidateRefreshToken(payload, this.token);
    }

    return payload;
  }
}
