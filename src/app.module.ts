import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeOrmConfig';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TodosModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
