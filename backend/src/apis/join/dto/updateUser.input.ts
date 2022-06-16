import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  pw: string;

  @Field(() => String, { nullable: true })
  nickname: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => String, { nullable: true })
  introduce: string;
}
