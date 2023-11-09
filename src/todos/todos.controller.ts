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

@Controller('todo')
export class TodoItemController {
  constructor(private readonly todoItemService: TodoItemService) {}

  @Get()
  findAll(): Promise<TodoItem[]> {
    return this.todoItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<TodoItem> {
    return this.todoItemService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() todoItemData: CreateTodoDto, @User() user): Promise<TodoItem> {
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
