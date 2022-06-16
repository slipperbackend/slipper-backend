import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BusinessBoardImage } from 'src/apis/BusinessBoardImage/entities/BusinessBoardImage.entity';
import { Join } from 'src/apis/join/entities/join.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class BusinessBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  thumbnail: string;

  @Column()
  @Field(() => Int)
  score: number;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  lat: string;

  @Column()
  @Field(() => String)
  lng: string;

  @Column()
  @Field(() => String)
  place: string;

  @Column({ default: 0 })
  @Field(() => Int)
  likeCount: number;

  @Column({ default: null })
  @Field(() => Date, { nullable: true })
  createAt: Date;

  @Column({ default: null })
  @Field(() => Date, { nullable: true })
  updateAt: Date;

  @UpdateDateColumn()
  sortDate: Date;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  startDate: string;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  endDate: string;

  @OneToMany(() => BusinessBoardImage, (images) => images.businessBoard)
  @Field(() => [BusinessBoardImage], { nullable: true })
  images: BusinessBoardImage[];

  @ManyToOne(() => Join, { cascade: true, onDelete: 'CASCADE' })
  @Field(() => Join)
  user: Join;
}
