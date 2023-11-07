import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemService } from './todos.service';

describe('TodosService', () => {
  let service: TodoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoItemService],
    }).compile();

    service = module.get<TodoItemService>(TodoItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
