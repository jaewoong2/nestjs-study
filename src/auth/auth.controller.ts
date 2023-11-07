import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalServiceAuthGuard } from './guard/local-service.guard';
import { User } from 'src/todos/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalServiceAuthGuard)
  @Post('login')
  async login(@Req() { user }: { user: User }) {
    const token = await this.authService.jwtLogin(user);
    return token;
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.jwtSignin(createUserDto);
  }
}
