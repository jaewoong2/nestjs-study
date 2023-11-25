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

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  access_token: string;

  @OneToMany(() => TodoList, (todolist) => todolist.user)
  todolists: TodoList[];
}
