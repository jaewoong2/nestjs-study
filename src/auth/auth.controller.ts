import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalServiceAuthGuard } from './guard/local-service.guard';
import { User } from 'src/todos/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.jwtSignin(createUserDto);
  }
}
