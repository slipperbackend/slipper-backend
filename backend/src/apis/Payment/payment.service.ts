import axios from 'axios';
import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Join } from '../join/entities/join.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './payment.entity';
import { getToday } from 'src/commons/libraries/utils';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,

    private readonly connection: Connection,
  ) {}

  async getToken() {
    try {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IAMPORT_API_KEY,
        imp_secret: process.env.IAMPORT_SECRET,
      });
      console.log(`토큰 받기 성공!! ${result.data.response.access_token}`);

      return result.data.response.access_token;
    } catch (error) {
      console.log('🚨  getToken 오류 발생  🚨');
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  async checkPaid({ impUid, token, amount }) {
    try {
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        { headers: { Authorization: token } },
      );

      if (result.data.response.status !== 'paid')
        throw new ConflictException(`결제 내역이 존재하지 않습니다. [${result.data.response.status} !== 'paid']
        `);

      if (result.data.response.amount !== amount)
        throw new UnprocessableEntityException(`결제 금액이 잘못되었습니다. [${result.data.response.amount} !== ${amount}]
        `);
    } catch (error) {
      console.log('🚨  checkPaid 오류 발생  🚨');
      if (error?.response?.data?.message) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }

  async checkDuplicate({ impUid }) {
    const result = await this.paymentRepository.findOne({ impUid });
    if (result)
      throw new ConflictException(`이미 결제된 아이디입니다. [${impUid}]`);
  }

  async findPayment({ userId }) {
    const result = await this.paymentRepository.find({
      user: userId,
    });

    return result;
  }

  async create({ impUid, amount, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      let type;
      let period;
      if (amount === 20000) {
        type = PAYMENT_STATUS_ENUM.DAY90;
        period = 90;
      } else if (amount === 7000) {
        type = PAYMENT_STATUS_ENUM.DAY30;
        period = 30;
      } else if (amount === 2000) {
        type = PAYMENT_STATUS_ENUM.DAY7;
        period = 7;
      }

      const today = new Date(getToday());
      const end = new Date(getToday(period));

      const paymentHistory = this.paymentRepository.create({
        impUid,
        paymentStatus: '결제',
        subStart: today,
        subEnd: end,
        subType: type,
        paymentAmount: amount,
        user: currentUser,
      });

      const paymentData = this.joinRepository.create({
        id: currentUser,
        subStart: today,
        subEnd: end,
        subType: type,
      });

      await queryRunner.manager.save(paymentData);
      await queryRunner.manager.save(paymentHistory);
      await queryRunner.commitTransaction();

      return paymentHistory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async refund({ impUid, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const result = this.paymentRepository.findOne({
        impUid,
        user: currentUser,
      });

      const paymentHistory = this.paymentRepository.create({
        ...result,
        paymentStatus: '환불',
      });

      const paymentData = this.joinRepository.create({
        id: currentUser,
        subStart: null,
        subEnd: null,
        subType: null,
      });

      await queryRunner.manager.save(paymentData);
      await queryRunner.manager.save(paymentHistory);
      await queryRunner.commitTransaction();

      return paymentHistory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async update({ userId }) {
    await this.joinRepository.save({
      id: userId,
      subStart: null,
      subEnd: null,
      subType: null,
    });

    return `구독권 만료처리 ${userId}`;
  }
}
