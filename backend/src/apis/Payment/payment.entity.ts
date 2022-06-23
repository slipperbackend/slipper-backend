import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Join } from '../join/entities/join.entity';

export enum PAYMENT_STATUS_ENUM {
  DAY7 = 'DAY7',
  DAY30 = 'DAY30',
  DAY90 = 'DAY90',
}

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Field(() => String, { nullable: true })
  paymentStatus: string;

  @Column()
  @Field(() => Date, { nullable: true })
  subStart: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  subEnd: Date;

  @Column({ default: null })
  @Field(() => Date, { nullable: true })
  subRefund: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  paymentAmount: number;

  @Column()
  @Field(() => String, { nullable: true })
  impUid: string;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM }) //
  @Field(() => PAYMENT_STATUS_ENUM, { nullable: true })
  subType: string;

  @ManyToOne(() => Join, (user) => user.payment)
  @Field(() => Join, { nullable: true })
  user: Join;
}
