import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Board } from '../Board/board.entity';
import { BoardLikeService } from './boardLike.service';
import { BoardLike } from './entities/boardLike.entity';

@Resolver()
export class BoardLikeResolver {
  constructor(
    private readonly boardLikeService: BoardLikeService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BoardLike)
  async clickLike(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.boardLikeService.like({ boardId, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [BoardLike])
  async fetchLikeBoards(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ) {
    if (page <= 0) page = 1;
    return await this.boardLikeService.fetchLikeBoards({ page, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => BoardLike)
  async fetchUserLike(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardLikeService.fetchUserLike({ boardId, currentUser });
  }
}
