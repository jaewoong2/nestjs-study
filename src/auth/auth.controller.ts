import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalServiceAuthGuard } from './guard/local-service.guard';
import { User } from 'src/todos/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { RefreshAuthGuard } from './guard/refresh.guard';
import { UserToken } from './strategy/refresh.strategy';
import { LoginEmailDto } from './dto/login-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-email')
  async sendEmail(@Body() { redirectTo, email }: LoginEmailDto) {
    this.authService.sendMagicLink({ redirectTo, email });
    return 'Mail Send';
  }

  @Get('login-email/:token')
  async getToken(
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { redirectTo } = await this.authService.loginByMagiclink(token);

    return res.redirect(redirectTo);
  }

  @UseGuards(LocalServiceAuthGuard)
  @Post('login')
  async login(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.jwtLogin(user);

    res.cookie('Authorization', `Bearer ${token.access_token}`, {
      httpOnly: true,
    });

    res.cookie('Refresh', `${token.refresh_token}`);

    return token;
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() { user }: { user: UserToken },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.refresh(user);

    res.cookie('Authorization', `Bearer ${token.access_token}`, {
      httpOnly: true,
    });

    res.cookie('Refresh', `${token.refresh_token}`);
    return token;
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.jwtSignin(createUserDto);
  }
}
