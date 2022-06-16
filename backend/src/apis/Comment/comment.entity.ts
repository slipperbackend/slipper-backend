import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../Board/board.entity';
import { SubComment } from '../SubComment/subcomment.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String, { nullable: true })
  nickname: string;

  @Column()
  @Field(() => String, { nullable: true })
  contents: string;

  @Column()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl: string;

  @ManyToOne(() => Board, (board) => board.comment, {
    onDelete: 'CASCADE',
  })
  @Field(() => Board)
  board: Board;

  @OneToMany(() => SubComment, (subComment) => subComment.comment, {
    cascade: true,
  })
  @Field(() => [SubComment], { nullable: true })
  subComment: SubComment[];
}
