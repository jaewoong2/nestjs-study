import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TodoList } from './todolist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => TodoList, (todolist) => todolist.user)
  todolists: TodoList[];
}
