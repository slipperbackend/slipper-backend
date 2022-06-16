import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Join } from '../join/entities/join.entity';
import { Comment } from '../Comment/comment.entity';
import { SubComment } from './subcomment.entity';
import { SubCommentResolver } from './subcomment.resolver';
import { SubCommentService } from './subcomment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Join, Comment, SubComment])],
  providers: [SubCommentResolver, SubCommentService],
})
@Module({})
export class SubCommentModule {}
