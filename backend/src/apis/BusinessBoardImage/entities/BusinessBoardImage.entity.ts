import { Field, ObjectType } from '@nestjs/graphql';
import { BusinessBoard } from 'src/apis/businessBoard/entities/businessBoard.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class BusinessBoardImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  businessImageUrl: string;

  @ManyToOne(() => BusinessBoard, (businessBoard) => businessBoard.images)
  businessBoard: BusinessBoard;
}
