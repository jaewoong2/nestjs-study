// todoitem.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  // 항목 업데이트 시간을 자동으로 갱신
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;
}
