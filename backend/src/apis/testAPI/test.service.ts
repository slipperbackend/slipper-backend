import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { getToday } from 'src/commons/libraries/utils';
import { Board } from '../Board/board.entity';
import { Payment } from '../Payment/payment.entity';

@Injectable()
export class TestBoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,

    @InjectRepository(Payment)
    private readonly paymentService: Repository<Payment>, //
  ) {}

  async addPayment({ paymentAmount, impUid, subStart, subEnd, userId }) {
    const result = await this.paymentService.save({
      paymentAmount,
      impUid,
      subStart,
      subEnd,
      userId,
    });

    return result;
  }

  async findAll() {
    const result = await this.boardRepository.find({
      relations: ['images'],
    });
    console.log(result);
    return result;
  }

  async findUser({ email }) {
    const result = await this.joinRepository
      .createQueryBuilder('join') //
      .leftJoinAndSelect('join.payment', 'payment')
      .where('join.email = :email', { email })
      .getOne();

    console.log(result);
    return result;
  }

  async create({ createBoardInput, email }) {
    const findUserId = await this.joinRepository.findOne({
      email: email,
    });

    console.log(new Date(getToday()));
    createBoardInput.createdAt = new Date(getToday());

    let thumbnail;
    if (createBoardInput.images.length > 0) {
      thumbnail = createBoardInput.images[0];
    } else {
      thumbnail = null;
    }

    const userId = {
      id: findUserId.id,
      email: findUserId.email,
      nickname: findUserId.nickname,
      phone: findUserId.phone,
    };

    const result = await this.boardRepository.save({
      user: findUserId.id,
      thumbnail: thumbnail,
      nickname: findUserId.nickname,
      ...createBoardInput,
    });

    console.log(result);

    const boardId = result.id;
    const images = result.images;

    const returnImagelist = [];
    if (createBoardInput.images.length > 0) {
      await Promise.all(
        images.map(async (el) => {
          return new Promise(async (resolve, reject) => {
            const savedImage = await this.boardImageRepository.save({
              imageUrl: el,
              board: boardId,
            });
            returnImagelist.push(savedImage);

            if (savedImage) resolve(savedImage);
            else reject('에러');
          });
        }),
      );
    }

    result.user = userId;
    result.images = returnImagelist;
    result.nickname = userId.nickname;

    return result;
  }
}
