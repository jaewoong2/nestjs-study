import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  controllers: [AppController],
  imports: [
    TodosModule,
    SupabaseModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
