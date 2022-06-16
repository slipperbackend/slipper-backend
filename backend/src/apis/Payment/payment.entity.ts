import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  @Field(() => String)
  paymentStatus: string;

  @Column()
  @Field(() => Date)
  subStart: Date;

  @Column()
  @Field(() => Date)
  subEnd: Date;

  @Column()
  @Field(() => Date)
  subRefund: Date;

  @Column()
  @Field(() => Int)
  paymentAmount: number;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM }) //
  @Field(() => PAYMENT_STATUS_ENUM)
  subType: string;

  @ManyToOne(() => Join, (user) => user.payment)
  @Field(() => Join, { nullable: true })
  user: Join;
}
