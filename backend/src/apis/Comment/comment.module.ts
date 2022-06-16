import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Join } from '../join/entities/join.entity';
import { Comment } from './comment.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Join, Comment])],
  providers: [CommentResolver, CommentService],
})
@Module({})
export class CommentModule {}
