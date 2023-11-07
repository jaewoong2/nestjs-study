import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from 'src/todos/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // get JWT from Header
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // get JWT from cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.jwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: User) {
    return payload;
  }
}
