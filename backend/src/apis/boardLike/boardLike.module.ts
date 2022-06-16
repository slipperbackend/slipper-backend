import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../Board/board.entity';
import { Join } from '../join/entities/join.entity';
import { BoardLikeResolver } from './boardLike.resolver';
import { BoardLikeService } from './boardLike.service';
import { BoardLike } from './entities/boardLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardLike, Join])],
  providers: [
    BoardLikeResolver, //
    BoardLikeService,
  ],
})
export class BoardLikeModule {}
