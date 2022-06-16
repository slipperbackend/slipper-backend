import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/Board/board.entity';
import { Join } from 'src/apis/join/entities/join.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class BoardLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @ManyToOne(() => Board, (board) => board.likeCount, {
    onDelete: 'CASCADE',
  })
  @Field(() => Board)
  board: Board;

  @ManyToOne(() => Join, (join) => join.likeList, { onDelete: 'CASCADE' })
  @Field(() => Join)
  join: Join;
}
