import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../Board/board.entity';
import { BoardService } from '../Board/board.service';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { BusinessUserService } from '../businessBoard/businessBoard.service';
import { BusinessBoard } from '../businessBoard/entities/businessBoard.entity';
import { BusinessBoardImage } from '../BusinessBoardImage/entities/BusinessBoardImage.entity';
import { Comment } from '../Comment/comment.entity';
import { CommentService } from '../Comment/comment.service';
import { Join } from '../join/entities/join.entity';
import { SubComment } from '../SubComment/subcomment.entity';
import { SubCommentService } from '../SubComment/subcomment.service';
import { AdminResolver } from './admin.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board,
      BoardImage,
      Join,
      Comment,
      SubComment,
      BusinessBoard,
      BusinessBoardImage,
    ]),
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_IP,
    }),
  ],
  providers: [
    AdminResolver, //
    BoardService,
    CommentService,
    SubCommentService,
    BusinessUserService,
  ],
})
export class AdminModule {}
