import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Payment } from 'src/apis/Payment/payment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  USER = 'USER',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
}

registerEnumType(Role, { name: 'Role' });
@Entity()
@ObjectType()
export class Join {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) 일단 해싱전이니까 그냥 두고 해봅시당!!!
  pw: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  introduce: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  businessImageUrl: string;

  @Column({ default: 0 })
  @Field(() => Int)
  likeList: number;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field(() => Role)
  role: Role;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  subStart: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  subEnd: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  subType: string;

  @OneToMany(() => Payment, (payment) => payment.user)
  @Field(() => [Payment], { nullable: true })
  payment: Payment[];
}
