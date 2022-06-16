import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Board } from '../Board/board.entity';
import { CreateBoardInput } from '../Board/dto/create_board.input';
import { TestBoardService } from './test.service';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Join } from '../join/entities/join.entity';
import { getToday } from 'src/commons/libraries/utils';

@Resolver()
export class TestAPIResolver {
  constructor(
    private readonly testBoardService: TestBoardService, //
  ) {}

  @Query(() => String)
  TEST_API() {
    return `${getToday()}  테스트 완료! 접속되었습니다 - slipper!`;
  }

  @Query(() => [Board])
  TEST_fetchBoards() {
    return this.testBoardService.findAll();
  }

  @Query(() => [GraphQLJSONObject])
  TEST_fetchBoardsPage(
    @Args('page', { nullable: true }) page: number, //
    @Args('category', { nullable: true }) category: string,
    @Args('search', { nullable: true }) search: string,
  ) {
    const result = [];
    const data = {
      _index: 'slipper-elasticsearch',
      _type: '_doc',
      _id: '아이디예시 - bd618aa4e83a',
      _score: null,
      _source: {
        likecount: 0,
        place: '프레퍼스',
        id: '아이디예시 - bd618aa4e83a',
        nickname: '최성환',
        address: `${search}`,
        createdat: '2022-05-21T11:43:15.000Z',
        thumbnail:
          'https://storage.googleapis.com/slipper-storage/board/9b3fce98-b0da-42fc-a089-24d103ce1a47/penguin3.jpeg',
        category: `${category}`,
        sortdate: 1653100995.844904,
        title: '여기 정말 맛있습니다! 강추!!',
      },
      sort: [1653133395000],
    };

    for (let i = 0; i < 5; i++) {
      result.push(data);
    }

    return result;
  }

  @Mutation(() => Board)
  async TEST_createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
    @Args('email') email: string,
  ) {
    const result = await this.testBoardService.create({
      createBoardInput,
      email: email,
    });

    return result;
  }

  @Query(() => Join)
  async TEST_fetchUser(
    @Args('email') email: string, //
  ) {
    return await this.testBoardService.findUser({ email });
  }

  @Mutation(() => String)
  async TEST_payment(
    @Args('paymentAmount') paymentAmount: number,
    @Args('impUid') impUid: string,
    @Args('subStart') subStart: Date,
    @Args('subEnd') subEnd: Date,
    @Args('userId') userId: string,
  ) {
    return await this.testBoardService.addPayment({
      paymentAmount,
      impUid,
      subStart,
      subEnd,
      userId,
    });
  }
}
