import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Join } from '../join/entities/join.entity';
import { getToday } from 'src/commons/libraries/utils';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async findAll({ boardId }) {
    const result = await this.commentRepository.find({
      where: { board: boardId },
      order: {
        createdAt: 'ASC',
      },
    });

    return result;
  }

  async create({ boardId, contents, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    const result = await this.commentRepository.save({
      nickname: user.nickname,
      imageUrl: user.imageUrl,
      contents: contents,
      createdAt: new Date(getToday()),
      board: boardId,
    });

    return result;
  }

  async update({ commentId, contents, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    const oldComment = await this.commentRepository.findOne({
      where: { id: commentId, nickname: user.nickname }, //
    });

    console.log(oldComment);
    await this.commentRepository.save({
      ...oldComment,
      contents,
    });

    return `수정 완료 - ${commentId} - ${contents}`;
  }

  async delete({ commentId, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    await this.commentRepository.delete({
      id: commentId,
      nickname: user.nickname,
    });

    return `삭제 완료 - ${commentId}`;
  }
}
