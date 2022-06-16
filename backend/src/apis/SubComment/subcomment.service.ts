import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Join } from '../join/entities/join.entity';
import { getToday } from 'src/commons/libraries/utils';
import { SubComment } from './subcomment.entity';

@Injectable()
export class SubCommentService {
  constructor(
    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async findAll({ commentId }) {
    const result = await this.subCommentRepository.find({
      where: { comment: commentId },
      order: {
        createdAt: 'ASC',
      },
    });

    return result;
  }

  async create({ commentId, contents, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    const result = await this.subCommentRepository.save({
      nickname: user.nickname,
      imageUrl: user.imageUrl,
      contents: contents,
      createdAt: new Date(getToday()),
      comment: commentId,
    });

    return result;
  }

  async update({ subCommentId, contents, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    const oldSubComment = await this.subCommentRepository.findOne({
      where: { id: subCommentId, nickname: user.nickname }, //
    });

    await this.subCommentRepository.save({
      ...oldSubComment,
      contents,
    });

    return `수정 완료 - ${subCommentId} - ${contents}`;
  }

  async delete({ subCommentId, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    await this.subCommentRepository.delete({
      id: subCommentId,
      nickname: user.nickname,
    });

    return `삭제 완료 - ${subCommentId}}`;
  }
}
