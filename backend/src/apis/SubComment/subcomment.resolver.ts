import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { GraphQLJSONObject } from 'graphql-type-json';
import { SubCommentService } from './subcomment.service';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SubComment } from './subcomment.entity';

@Resolver()
export class SubCommentResolver {
  constructor(
    private readonly subCommentService: SubCommentService, //
  ) {}

  @Query(() => [SubComment])
  async fetchSubComment(@Args('commentId') commentId: string) {
    return await this.subCommentService.findAll({
      commentId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GraphQLJSONObject)
  async createSubComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('commentId') commentId: string,
    @Args('content') contents: string,
  ) {
    return await this.subCommentService.create({
      commentId,
      contents,
      currentUser: currentUser.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateSubComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('subCommentId') subCommentId: string,
    @Args('content') contents: string,
  ) {
    return await this.subCommentService.update({
      subCommentId,
      contents,
      currentUser: currentUser.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteSubComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('subCommentId') subCommentId: string, //
  ) {
    return await this.subCommentService.delete({
      subCommentId,
      currentUser: currentUser.id,
    });
  }
}
