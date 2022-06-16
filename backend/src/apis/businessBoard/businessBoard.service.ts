import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getToday } from 'src/commons/libraries/utils';
import { getRepository, Repository } from 'typeorm';
import { BusinessBoardImage } from '../BusinessBoardImage/entities/BusinessBoardImage.entity';
import { Join } from '../join/entities/join.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BusinessBoard } from './entities/businessBoard.entity';

@Injectable()
export class BusinessUserService {
  constructor(
    @InjectRepository(BusinessBoard)
    private readonly businessBoardRepository: Repository<BusinessBoard>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,

    @InjectRepository(BusinessBoardImage)
    private readonly businessBoardImageRepository: Repository<BusinessBoardImage>,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async create({ createBusinessBoardInput, email }) {
    const checkBusinessUser = await this.joinRepository.findOne({
      email,
    });

    const businessUser = {
      id: checkBusinessUser.id,
      nickname: checkBusinessUser.nickname,
    };

    createBusinessBoardInput.createAt = getToday();

    let thumbnail;

    if (createBusinessBoardInput.images.length > 0) {
      thumbnail = createBusinessBoardInput.images[0];
    } else {
      thumbnail = null;
    }

    const result = await this.businessBoardRepository.save({
      user: businessUser.id,
      thumbnail: thumbnail,
      ...createBusinessBoardInput,
      nickname: businessUser.nickname,
    });
    const imageList = [];
    const images = result.images;
    if (createBusinessBoardInput.images.length > 0) {
      await Promise.all(
        images.map(async (el) => {
          return new Promise(async (resolve, reject) => {
            const saveImage = await this.businessBoardImageRepository.save({
              businessImageUrl: el,
              businessBoard: result.id,
            });
            imageList.push(saveImage);

            if (saveImage) resolve(saveImage);
            else reject('에러');
          });
        }),
      );
    }
    return result;
  }

  async update({ businessBoardId, updateBusinessBoardInput }) {
    const oldBoard = await this.businessBoardRepository.findOne({
      where: { id: businessBoardId },
      relations: ['images', 'user'],
    });
    const newImages = updateBusinessBoardInput.images;
    const oldImages = oldBoard.images;

    if (newImages === 0) updateBusinessBoardInput.thumbnail = null;
    const newBusinessBoard = {
      ...oldBoard,
      thumbnail: updateBusinessBoardInput.images[0],
      ...updateBusinessBoardInput,
      update: getToday(),
    };
    const result = await this.businessBoardRepository.save({
      ...newBusinessBoard,
    });
    const returnImages = [];
    if (newImages !== undefined) {
      const saveNewImages = [];
      const deleteImages = [];
      const filteredImages = [];

      for (const e of oldImages) {
        if (!newImages.includes(e.businessImageUrl)) deleteImages.push(e.id);
        else {
          filteredImages.push(e.businessImageUrl);
          returnImages.push({
            id: e.id,
            imageUrl: e.businessImageUrl,
          });
        }
      }

      for (const e of newImages) {
        if (!filteredImages.includes(e)) saveNewImages.push(e);
      }

      for (const e of deleteImages) {
        await this.businessBoardImageRepository.delete({ id: e });
      }

      for (const e of saveNewImages) {
        const resultImages = await this.businessBoardImageRepository.save({
          businessImageUrl: e,
          businessBoard: businessBoardId,
        });

        returnImages.push({
          id: resultImages.id,
          businessUrl: resultImages.businessImageUrl,
        });
      }
    }

    //----- 수정된 내용 프론트에 전달하기
    result.images = returnImages;

    return result;
  }

  async findOne({ businessBoardId }) {
    return await this.businessBoardRepository.findOne({
      where: { id: businessBoardId }, //
      relations: ['images'],
    });
  }

  async delete({ businessBoardId }) {
    const findBusinessBoard = await this.businessBoardRepository.findOne({
      where: { id: businessBoardId },
      relations: ['images'],
    });
    for (const e of findBusinessBoard.images) {
      await this.businessBoardImageRepository.delete({ id: e.id });
    }
    const result = await this.businessBoardRepository.delete({
      id: businessBoardId,
    });
    return result.affected
      ? `[삭제 성공] ${businessBoardId}`
      : `[삭제실패] ${businessBoardId}`;
  }

  async fetchBusinessBoards({ currentUser }) {
    return await getRepository(BusinessBoard)
      .createQueryBuilder('businessBoard')
      .innerJoinAndSelect('businessBoard.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id })
      .orderBy('businessBoard.createdAt', 'DESC')
      .getMany();
  }

  async loadPage({ category, search, sortType, page }) {
    const skip = (page - 1) * 10;

    let type: any;
    if (sortType === 'like') {
      type = 'likecount:desc';
    } else {
      type = 'createdat:desc';
    }

    let result: any;
    if (search === undefined || search === null || search === '') {
      //전체 글 기준으로 전달 (검색페이지 메인)
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: type,
        query: {
          match_all: {},
        },

        from: skip,
        size: 10,
      });
    } else if (category === undefined || category === null || category === '') {
      // 검색결과를 기준으로 전달 = 검색키워드
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: type,
        query: {
          prefix: { address: search },
        },

        from: skip,
        size: 10,
      });
    } else {
      // 검색결과를 기준으로 전달 = 검색키워드 + 카테고리
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: type,
        query: {
          bool: {
            must: [
              { prefix: { address: search } },
              { match: { category: category } },
            ],
          },
        },

        from: skip,
        size: 10,
      });
    }

    return result.hits.hits;
  }
}
