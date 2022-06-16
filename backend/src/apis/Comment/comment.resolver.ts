import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Comment } from './comment.entity';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Query(() => [Comment])
  async fetchComments(
    @Args('boardId') boardId: string, //
  ) {
    return await this.commentService.findAll({
      boardId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GraphQLJSONObject)
  async createComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('boardId') boardId: string,
    @Args('content') contents: string,
  ) {
    return await this.commentService.create({
      boardId,
      contents,
      currentUser: currentUser.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('commentId') commentId: string,
    @Args('content') contents: string,
  ) {
    return await this.commentService.update({
      commentId,
      contents,
      currentUser: currentUser.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('commentId') commentId: string, //
  ) {
    return await this.commentService.delete({
      commentId,
      currentUser: currentUser.id,
    });
  }
}
