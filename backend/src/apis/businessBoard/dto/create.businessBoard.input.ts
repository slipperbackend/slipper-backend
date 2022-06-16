import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBusinessBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String)
  category: string;

  @Field(() => String, { nullable: true })
  thumbnail: string;

  @Field(() => [String], { nullable: true })
  images: string;

  @Field(() => Int)
  score: number;

  @Field(() => String)
  address: string;

  @Field(() => String)
  lat: string;

  @Field(() => String)
  lng: string;

  @Field(() => String)
  place: string;

  @Field(() => String, { nullable: true })
  startDate: string;

  @Field(() => String, { nullable: true })
  endDate: string;

  // @Field(() => Int, { nullable: true })
  // likeCount: number;
}
