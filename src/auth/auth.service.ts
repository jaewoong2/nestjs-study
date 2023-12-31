import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/todos/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserToken } from './strategy/auth.strategy';
import * as nodemailer from 'nodemailer';
import { LoginEmailDto } from './dto/login-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // auth.module의 JwtModule로부터 공급 받음
  ) {}

  async loginByMagiclink(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken === 'string') throw new UnauthorizedException();

      if (!('email' in decodedToken && 'redirectTo' in decodedToken)) {
        throw new UnauthorizedException('옳지 않은 Token 입니다');
      }

      const { email, redirectTo } = decodedToken;

      const user = await this.userRepository.findOne({ where: { email } });
      const refreshToken = this.jwtService.sign(
        { email },
        {
          expiresIn: '7d', // 리프레시 토큰의 유효 기간
        },
      );

      if (user && user.access_token === token) {
        throw new UnauthorizedException('만료된 토큰 입니다.');
      }

      this.userRepository.save({
        email,
        username: email,
        access_token: token,
        refresh_token: refreshToken,
      });

      return {
        email,
        redirectTo: new URL(redirectTo).href,
      };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async sendMagicLink({ email, redirectTo }: LoginEmailDto): Promise<void> {
    const payload = { email, redirectTo };
    const token = this.jwtService.sign(payload);
    const link = `${process.env.REDIRECT_MAIL}/${token}`;

    // Nodemailer 설정
    const transporter = nodemailer.createTransport({
      // SMTP 설정 (예: Gmail, Outlook 등)
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSOWRD,
      },
    });

    // 이메일 옵션 설정
    const mailOptions = {
      from: '"Lime" <jwisgenius@gmail.com>',
      to: email,
      subject: 'Login Magic Link',
      html: `<p>Click <a href="${link}">here</a> to log in</p>`,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);
  }

  async isValidateToken(token: number) {
    const now = new Date().getTime();
    return now <= token;
  }

  async isValidateRefreshToken(payload: UserToken, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (user.refresh_token !== refreshToken) {
      throw new UnauthorizedException('옳지 않은 Refresh Token Value');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refresh({ exp, iat, ...payload }: UserToken) {
    const token = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d', // 리프레시 토큰의 유효 기간
      }),
    };

    await this.userRepository.update(
      { id: payload.id },
      { refresh_token: token.refresh_token, access_token: token.access_token },
    );

    return token;
  }

  async validateServiceUser(email: string, password: string) {
    const user = await this.findOneByEmail(email, { notException: false });

    if (!user) {
      throw new ForbiddenException('존재 하지 않는 유저 입니다.');
    }
    const isPasswordCheck = await bcrypt.compare(password, user.password);

    if (!isPasswordCheck) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }

    return user;
  }

  async findOneByEmail(
    email: string,
    { notException }: { notException?: boolean } = { notException: true },
  ) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });

    if (user && notException) {
      throw new BadRequestException('이미 존재하는 이메일 입니다.');
    }

    return user;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 11);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async jwtLogin({ password, ...payload }: Partial<User>) {
    const token = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d', // 리프레시 토큰의 유효 기간
      }),
    };

    await this.userRepository.update(
      { id: payload.id },
      { refresh_token: token.refresh_token, access_token: token.access_token },
    );

    return token;
  }

  async jwtSignin(data: CreateUserDto) {
    await this.findOneByEmail(data.email);

    const password = await this.hashPassword(data.password);

    const user = this.userRepository.create({
      email: data.email,
      username: data.username,
      password,
    });

    await this.userRepository.save(user);
    return user;
  }
}
