import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  status?: string;

  @IsInt()
  @IsOptional()
  todolistId?: number; // 클라이언트가 TodoItem을 생성할 때 TodoList의 ID를 제공해야 합니다.
}
