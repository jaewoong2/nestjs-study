import { Module } from '@nestjs/common';
import { TodoItemService } from './todos.service';
import { TodoItemController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './entities/todoitem.entity';
import { TodoItemTag } from './entities/todoitemtag.entity';
import { Tag } from './entities/tag.entity';
import { TodoList } from './entities/todolist.entity';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TodoList, TodoItem, Tag, TodoItemTag]),
    AuthModule,
  ],
  controllers: [TodoItemController],
  providers: [TodoItemService],
})
export class TodosModule {}
