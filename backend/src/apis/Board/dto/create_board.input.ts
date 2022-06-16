import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  category: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  thumbnail: string;

  @Field(() => Int)
  score: number;

  @Field(() => String, { nullable: true })
  startDate: string;

  @Field(() => String, { nullable: true })
  endDate: string;

  @Field(() => String)
  lat: string;

  @Field(() => String)
  lng: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  groupCode: string;

  @Field(() => String)
  place: string;

  @Field(() => String, { nullable: true })
  placePhone: string;

  @Field(() => String, { nullable: true })
  placeUrl: string;

  @Field(() => [String], { nullable: true })
  images: string;
}
