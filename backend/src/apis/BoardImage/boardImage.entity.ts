import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../Board/board.entity';

@Entity()
@ObjectType()
export class BoardImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  imageUrl: string;

  @ManyToOne(() => Board, (board) => board.images, { onDelete: 'CASCADE' })
  board: Board;
}
