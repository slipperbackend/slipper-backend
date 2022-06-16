import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { RolesGuard } from 'src/commons/auth/gql-role.guard';
import { Roles } from 'src/commons/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Board } from '../Board/board.entity';
import { Role } from '../join/entities/join.entity';
import { BusinessUserService } from './businessBoard.service';
import { CreateBusinessBoardInput } from './dto/create.businessBoard.input';
import { updateBusinessBoardInput } from './dto/update.businessBoard.input';
import { BusinessBoard } from './entities/businessBoard.entity';

@Resolver()
export class BusinessUserResolver {
  constructor(
    private readonly businessUserService: BusinessUserService, //
  ) {}

  @Roles(Role.BUSINESS)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BusinessBoard)
  async createBusinessBoard(
    @Args('createBusinessBoardInput')
    createBusinessBoardInput: CreateBusinessBoardInput,
    @CurrentUser() currentUser: any,
  ) {
    return await this.businessUserService.create({
      createBusinessBoardInput,
      email: currentUser.email, //성환 추가
    });
  }

  @Roles(Role.BUSINESS)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => BusinessBoard)
  async updateBusinessBoard(
    @Args('businessBoardId') businessBoardId: string,
    @Args('updateBusinessBoardInput')
    updateBusinessBoardInput: updateBusinessBoardInput, //
  ) {
    return this.businessUserService.update({
      businessBoardId,
      updateBusinessBoardInput,
    });
  }

  @Roles(Role.BUSINESS)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deleteBusinessBoard(
    @Args('businessBoardId') businessBoardId: string, //
  ) {
    return this.businessUserService.delete({ businessBoardId });
  }

  @Query(() => BusinessBoard)
  fetchBusinessBoard(
    @Args('businessBoardId') businessBoardId: string, //
  ) {
    return this.businessUserService.findOne({ businessBoardId });
  }

  @Roles(Role.BUSINESS)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [BusinessBoard])
  async fetchBusinessBoards(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.businessUserService.fetchBusinessBoards({
      currentUser,
    });
  }

  @Query(() => [GraphQLJSONObject])
  async fetchBusinessBoardsPage(
    @Args('category', { nullable: true }) category: string,
    @Args('search', { nullable: true }) search: string,
    @Args('sortType', { nullable: true }) sortType: string,
    @Args({ name: 'page', nullable: true, type: () => Int }) page: number,
  ) {
    const result = await this.businessUserService.loadPage({
      category,
      search,
      sortType,
      page,
    });
    console.log(result);
    return result;
  }
}
