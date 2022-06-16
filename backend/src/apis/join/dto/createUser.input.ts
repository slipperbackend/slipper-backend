import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  pw: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => String, { nullable: true })
  introduce: string;

  @Field(() => String, { nullable: true })
  businessImageUrl: string;
}
