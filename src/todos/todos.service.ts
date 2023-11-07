// todo-item.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from './entities/todoitem.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
  ) {}

  findAll(): Promise<TodoItem[]> {
    return this.todoItemRepository.find();
  }

  findOne(id: number): Promise<TodoItem> {
    return this.todoItemRepository.findOneBy({ id: id });
  }

  async create(todoItemData: CreateTodoDto): Promise<TodoItem> {
    const todoItem = this.todoItemRepository.create(todoItemData);
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
