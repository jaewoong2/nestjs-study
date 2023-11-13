// todo-item.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from './entities/todoitem.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoList } from './entities/todolist.entity';
import { User } from './entities/user.entity';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
    @InjectRepository(TodoList)
    private readonly todolistRepository: Repository<TodoList>,
  ) {}

  findAll(user: User): Promise<TodoItem[]> {
    return this.todoItemRepository.find({ where: { user: { id: user.id } } });
  }

  findOne(id: number): Promise<TodoItem> {
    return this.todoItemRepository.findOneBy({ id: id });
  }

  async create(todoItemData: CreateTodoDto, user: User): Promise<TodoItem> {
    const todolist = this.todolistRepository.create({
      title: user.email,
      user: {
        email: user.email,
        username: user.username,
        id: user.id,
      },
    });

    const todoItem = this.todoItemRepository.create({
      ...todoItemData,
      user: {
        email: user.email,
        username: user.username,
        id: user.id,
      },
    });

    await this.todolistRepository.save(todolist);
    await this.todoItemRepository.save(todoItem);
    return todoItem;
  }

  async update(id: number, updateData: Partial<TodoItem>): Promise<TodoItem> {
    await this.todoItemRepository.update(id, updateData);
    return this.todoItemRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.todoItemRepository.delete(id);
  }
}
