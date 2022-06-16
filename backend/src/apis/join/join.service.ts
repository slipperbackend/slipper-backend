import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Join } from './entities/join.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class JoinService {
  constructor(
    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>, //
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // async create({ email, hashedPw: pw, phone, introduce, nickname, image })
  async create({ createUserInput }) {
    const userCheck = await this.joinRepository.findOne({
      where: { email: createUserInput.email },
    });
    const nicknameCheck = await this.joinRepository.findOne({
      where: { nickname: createUserInput.nickname },
    });
    if (nicknameCheck) throw new ConflictException('이미 등록된 닉네임입니다.');
    if (userCheck) throw new ConflictException('이미 등록된 메일 입니다.');
    if (!createUserInput.email.includes('@'))
      throw new ConflictException('email을 확인해주세요');
    return await this.joinRepository.save({
      ...createUserInput,
    });
  }

  async createSocial({ email, phone, nickname, pw }) {
    const user = await this.joinRepository.findOne({ email });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    return await this.joinRepository.save({
      email,
      pw,
      phone,
      nickname,
    });
  }

  async checkphone({ phone }) {
    if (phone.length !== 10 && phone.length !== 11)
      throw new ConflictException('핸드폰 번호를 확인해주세요.');
    const checkPhone = await this.joinRepository.findOne({ where: { phone } });
    if (checkPhone)
      throw new ConflictException('이미 등록된 핸드폰 번호입니다.');
    return await phone;
  }

  async getToken(mycount) {
    if (mycount === undefined) throw new ConflictException('토큰생성 불가');
    else if (mycount <= 0) throw new ConflictException('토큰생성 불가');
    else if (mycount > 10) throw new ConflictException('토큰생성 불가');
    const token = String(Math.floor(Math.random() * 10 ** mycount)).padStart(
      mycount,
      '0',
    );
    return token;
  }

  async redisToken({ phone, token }) {
    const checkPhone = await this.joinRepository.findOne({ where: { phone } });
    if (checkPhone) throw new ConflictException('핸드폰 번호를 확인해세요.');
    const redisToken = await this.cacheManager.get(phone);
    if (redisToken) await this.cacheManager.del(phone);
    await this.cacheManager.set(phone, token, { ttl: 180 });
    await this.cacheManager.get(phone);
    return '토큰 3분 타이머 시작';
  }

  async userRedisToken({ phone, token }) {
    const checkPhone = await this.joinRepository.findOne({ where: { phone } });
    if (!checkPhone) throw new ConflictException('회원이 아닙니다.');
    const redisToken = await this.cacheManager.get(phone);
    if (redisToken) await this.cacheManager.del(phone);
    await this.cacheManager.set(phone, token, { ttl: 180 });
    return '토큰타이머 돌아간다잉';
  }

  async checkToken({ mytoken, phone }) {
    const redisToken = await this.cacheManager.get(phone);
    if (mytoken === redisToken) {
      return '인증성공';
    } else {
      return '인증번호 확인해주세요.';
    }
  }

  async sendToSMS({ phone, token }) {
    const appKey = process.env.SMS_APP_KEY;
    const XSecretKey = process.env.SMS_X_SECRET_KEY;
    const sender = process.env.SMS_SENDER;

    await axios.post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
      {
        body: `안녕하세요. 인증번호는 ${token}`,
        sendNo: sender,
        recipientList: [{ internationalRecipientNo: phone }],
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );

    return '메세지 전송 완료!';
  }
  async sendEmail({ name, email }) {
    const appKey = process.env.EMAIL_APP_KEY;
    const XSecretKey = process.env.EMAIL_X_SECRET_KEY;
    const sender = process.env.EMAIL_SENDER;

    const result = await axios.post(
      `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appKey}/sender/mail`,
      {
        senderAddress: sender,
        title: `안녕하세요. ${name}님! 가입을 환영합니다.`,
        receiverList: [{ receiveMailAddr: email, receiveType: 'MRT0' }],
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );

    return '이메일이 갔습니다.?';
  }

  async findOne({ email }) {
    return await this.joinRepository.findOne({ where: { email } });
  }
  async emailFindone({ phone }) {
    return await this.joinRepository.findOne({ where: { phone } });
  }
  async findAll() {
    return await this.joinRepository.find({ relations: ['payment'] });
  }

  async findAllUser() {
    return await this.joinRepository.find({ withDeleted: true });
  }

  async checkNickname({ nickname }) {
    const checkNickname = await this.joinRepository.findOne({ nickname });
    if (checkNickname) throw new ConflictException('존재하는 닉네임이다.');
    return '등록 가능한 닉네임입니다.';
  }

  async update({ email, updateUserInput }) {
    const user = await this.joinRepository.findOne({ where: { email } });
    const checkNickname = await this.joinRepository.findOne({
      where: { nickname: updateUserInput.nickname },
    });

    if (checkNickname) throw new ConflictException('닉네임이 존재합니다.');
    const newUser = {
      ...user,
      ...updateUserInput,
    };

    return await this.joinRepository.save(newUser);
  }

  async updatePw({ email, pw }) {
    const user = await this.joinRepository.findOne({ where: { email } });
    if (!user) throw new ConflictException('회원이 없습니다.');
    const newPw = {
      ...user,
      pw,
    };
    return await this.joinRepository.save(newPw);
  }

  async delete({ email }) {
    const result = await this.joinRepository.softDelete({ email });
    return result.affected ? true : false;
  }
}
