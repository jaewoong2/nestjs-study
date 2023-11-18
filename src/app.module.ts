import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './typeOrmConfig';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
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
