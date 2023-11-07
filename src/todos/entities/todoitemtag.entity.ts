// todoitemtag.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag.entity';
import { TodoList } from './todolist.entity';

@Entity()
export class TodoItemTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TodoList, (todolist) => todolist)
  todolist: TodoList;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'todoitem_tags', // This is the table that will be created in the database to store the relation
    joinColumn: { name: 'todoitem_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
