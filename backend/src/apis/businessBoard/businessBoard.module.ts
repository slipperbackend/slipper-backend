import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessBoardImage } from '../BusinessBoardImage/entities/BusinessBoardImage.entity';
import { Join } from '../join/entities/join.entity';
import { BusinessUserResolver } from './businessBoard.resolver';
import { BusinessUserService } from './businessBoard.service';
import { BusinessBoard } from './entities/businessBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessBoard, Join, BusinessBoardImage]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    BusinessUserResolver, //
    BusinessUserService,
  ],
})
export class BusinessBoardModule {}
