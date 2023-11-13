// todo-item.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TodoItemService } from './todos.service';
import { TodoItem } from './entities/todoitem.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { User as TUser } from './entities/user.entity';

@Controller('todo')
export class TodoItemController {
  constructor(private readonly todoItemService: TodoItemService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: TUser): Promise<TodoItem[]> {
    return this.todoItemService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<TodoItem> {
    return this.todoItemService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() todoItemData: CreateTodoDto,
    @User() user: TUser,
  ): Promise<TodoItem> {
    return this.todoItemService.create(todoItemData, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<TodoItem>,
  ): Promise<TodoItem> {
    return this.todoItemService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.todoItemService.delete(id);
  }
}
