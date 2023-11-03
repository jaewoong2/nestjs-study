import { Injectable } from '@nestjs/common';

// Injectable() 데코레이터가 붙어있는 클래스는 NestJS가 인스턴스를 생성하여 다른 클래스에 생성자를 통해서 주입을 해줄 수 있습니다.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
