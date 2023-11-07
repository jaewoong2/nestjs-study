import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/todos/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // auth.module의 JwtModule로부터 공급 받음
  ) {}

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
  async jwtLogin({ password, ...payload }: User) {
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async jwtSignin(data: CreateUserDto) {
    await this.userRepository.findOne({ where: { email: data.email } });

    const password = await this.hashPassword(data.password);

    const todoItem = this.userRepository.create({
      email: data.email,
      username: data.username,
      password,
    });

    await this.userRepository.save(todoItem);

    return todoItem;
  }
}