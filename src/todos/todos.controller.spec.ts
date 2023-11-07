import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemController } from './todos.controller';
import { TodoItemService } from './todos.service';

describe('TodosController', () => {
  let controller: TodoItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [TodoItemService],
    }).compile();

    controller = module.get<TodoItemController>(TodoItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
