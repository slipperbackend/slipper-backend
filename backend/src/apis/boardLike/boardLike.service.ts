import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { getRepository, Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { Board } from '../Board/board.entity';
import { Join } from '../join/entities/join.entity';
import { BoardLike } from './entities/boardLike.entity';

@Injectable()
export class BoardLikeService {
  constructor(
    @InjectRepository(BoardLike)
    private readonly boardLikeRepository: Repository<BoardLike>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async like({ boardId, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser.id },
    });

    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    const likeBoard = await this.boardLikeRepository.findOne({
      where: { board: boardId, join: currentUser.id },
    });

    if (!likeBoard) {
      const newLikeBoard = await this.boardLikeRepository.save({
        isLike: true,
        board: board,
        join: user,
      });

      const likeCount = await this.boardLikeRepository.count({
        board: boardId,
        isLike: true,
      });

      const userCount = await this.boardLikeRepository.count({
        join: currentUser.id,
        isLike: true,
      });

      await this.joinRepository.save({
        ...user,
        likeList: userCount,
      });

      await this.boardRepository.save({
        ...board,
        likeCount,
      });

      return newLikeBoard;
    }
    let newLikeBoard;
    if (likeBoard.isLike === false) {
      newLikeBoard = await this.boardLikeRepository.save({
        ...likeBoard,
        isLike: true,
      });
    }

    if (likeBoard.isLike === true) {
      newLikeBoard = await this.boardLikeRepository.save({
        ...likeBoard,
        isLike: false,
      });
    }
    const userCount = await this.boardLikeRepository.count({
      join: currentUser.id,
      isLike: true,
    });

    const likeCount = await this.boardLikeRepository.count({
      board: boardId,
      isLike: true,
    });

    await this.joinRepository.save({
      ...user,
      likeList: userCount,
    });

    await this.boardRepository.save({
      ...board,
      likeCount: likeCount,
    });

    return newLikeBoard;
  }

  async fetchLikeBoards({ page, currentUser }) {
    return await getRepository(BoardLike)
      .createQueryBuilder('boardLike')
      .innerJoinAndSelect('boardLike.join', 'join')
      .innerJoinAndSelect('boardLike.board', 'board')
      .where('join.id = :userId', { userId: currentUser.id })
      .andWhere('boardLike.isLike = :isLike', { isLike: true })
      .orderBy('boardLike.createAt', 'DESC')
      .limit(4)
      .offset(4 * (page - 1))
      .getMany();
  }

  async fetchUserLike({ boardId, currentUser }) {
    return await this.boardLikeRepository.findOne({
      where: { board: boardId, join: currentUser.id },
      relations: ['board'],
    });
  }
}
