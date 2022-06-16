import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../Comment/comment.entity';

@Entity()
@ObjectType()
export class SubComment {
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

  @ManyToOne(() => Comment, (comment) => comment.subComment, {
    onDelete: 'CASCADE',
  })
  @Field(() => Comment)
  comment: Comment;
}
