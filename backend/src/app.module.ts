import { CacheModule, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

// API Modules
import { TestAPIModule } from './apis/testAPI/test.module';
import { BoardModule } from './apis/Board/board.module';
import { FileModule } from './apis/file/file.module';
import { CrontabModule } from './apis/crontab/crontab.module';
import { JoinModule } from './apis/join/join.module';
import { AuthModule } from './apis/auth/auth.module';
import { PaymentModule } from './apis/Payment/payment.module';
import { BusinessBoardImage } from './apis/BusinessBoardImage/entities/BusinessBoardImage.entity';
import { BusinessBoardModule } from './apis/businessBoard/businessBoard.module';
import { CommentModule } from './apis/Comment/comment.module';
import { SubCommentModule } from './apis/SubComment/subcomment.module';
import { AdminModule } from './apis/admin/admin.module';
import { BoardLikeModule } from './apis/boardLike/boardLike.module';

@Module({
  imports: [
    AdminModule,
    BoardLikeModule,
    BusinessBoardModule,
    BusinessBoardImage,
    JoinModule,
    AuthModule,
    TestAPIModule,
    CrontabModule,
    BoardModule,
    FileModule,
    PaymentModule,
    CommentModule,
    SubCommentModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.FOR_ROOT_HOST,
      port: 3306,
      username: process.env.FOR_ROOT_USERNAME,
      password: process.env.FOR_ROOT_PASSWORD,
      database: process.env.FOR_ROOT_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_IP,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
