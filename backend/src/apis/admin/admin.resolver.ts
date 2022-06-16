import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { RolesGuard } from 'src/commons/auth/gql-role.guard';
import { Roles } from 'src/commons/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { BoardService } from '../Board/board.service';
import { BusinessUserService } from '../businessBoard/businessBoard.service';
import { CommentService } from '../Comment/comment.service';
import { Role } from '../join/entities/join.entity';
import { SubCommentService } from '../SubComment/subcomment.service';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly boardService: BoardService, //
    private readonly commentService: CommentService,
    private readonly subCommentService: SubCommentService,
    private readonly businessUser: BusinessUserService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String)
  async deleteAdminUserBoard(
    @Args('boardId') boardId: string, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.boardService.delete({ boardId, currentUser: currentUser.id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String)
  async deleteAdiminBusinessBoard(
    @Args('businessBoardId') businessBoardId: string,
  ) {
    return this.businessUser.delete({ businessBoardId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String)
  async deleteAdminUserComment(
    @Args('commentId') commentId: string, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.commentService.delete({
      commentId,
      currentUser: currentUser.id,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String)
  @UseGuards(GqlAuthAccessGuard)
  async deleteAdminUserSubComment(
    @Args('subCommentId') subCommentId: string, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.subCommentService.delete({
      subCommentId,
      currentUser: currentUser.id,
    });
  }
}
