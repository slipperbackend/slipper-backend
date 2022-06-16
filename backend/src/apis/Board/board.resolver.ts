import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/create_board.input';
import { UpdateBoardInput } from './dto/update_board.input';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}

  @Query(() => Board)
  async fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return await this.boardService.findOne({ boardId });
  }

  @Query(() => [GraphQLJSONObject])
  async fetchBoardsPage(
    @Args('category', { nullable: true }) category: string,
    @Args('search', { nullable: true }) search: string,
    @Args('sortType', { nullable: true }) sortType: string,
    @Args({ name: 'page', nullable: true, type: () => Int }) page: number,
  ) {
    return await this.boardService.loadPage({
      category,
      search,
      sortType,
      page,
    });
  }

  @Query(() => Int)
  async fetchBoardLikeCount(
    @Args('boardId', { nullable: true }) boardId: string,
  ) {
    return await this.boardService.getLikeCount({
      boardId,
    });
  }

  // @Roles(Role.USER)
  // @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  async fetchUserBoards(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args({ name: 'page', nullable: true, type: () => Int }) page: number,
  ) {
    if (page <= 0) page = 1;
    return await this.boardService.fetchUserBoards({ currentUser, page });
  }

  @Query(() => [Board])
  async likeBoardsArray(
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ) {
    if (page <= 0) page = 1;
    return await this.boardService.likeBoardsArray({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    return this.boardService.create({
      createBoardInput,
      email: currentUser.email,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({
      boardId,
      updateBoardInput,
      currentUser: currentUser.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('boardId') boardId: string, //
  ) {
    return await this.boardService.delete({
      boardId,
      currentUser: currentUser.id,
    });
  }
}
