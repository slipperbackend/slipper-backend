import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { Board } from './board.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardImage, Join]),
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_IP,
    }),
  ],
  providers: [BoardResolver, BoardService],
})
export class BoardModule {}
