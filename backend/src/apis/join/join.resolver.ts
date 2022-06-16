import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Join } from './entities/join.entity';
import { JoinService } from './join.service';
import * as bcrypt from 'bcrypt';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserSaveInput } from './dto/updateUsersave.input';

@Resolver()
export class JoinResolver {
  constructor(
    private readonly joinService: JoinService, //
  ) {}

  @Mutation(() => Join)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const hashedPw = await bcrypt.hash(createUserInput.pw, 10);
    await this.joinService.checkphone({ phone: createUserInput.phone });
    createUserInput.pw = hashedPw;
    return this.joinService.create({
      createUserInput,
    });
  }

  @Mutation(() => String)
  async getToken(
    @Args('phone') phone: string, //
  ) {
    const token = await this.joinService.getToken(6);
    await this.joinService.redisToken({ phone, token });
    await this.joinService.sendToSMS({ phone, token });
    return '토큰생성 와완료';
  }
  @Mutation(() => String)
  async userGetToken(
    @Args('phone') phone: string, //
  ) {
    const token = await this.joinService.getToken(6);
    await this.joinService.userRedisToken({ phone, token });
    await this.joinService.sendToSMS({ phone, token });
    return '토큰 보냈다 화긴해라';
  }

  @Mutation(() => String)
  async proofToken(
    @Args('phone') phone: string, //
    @Args('mytoken') mytoken: string,
  ) {
    return await this.joinService.checkToken({ mytoken, phone });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Join)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserSaveInput, //
    @CurrentUser() currentUser: any,
  ) {
    return await this.joinService.update({
      email: currentUser.email,
      updateUserInput,
    });
  }

  @Mutation(() => String)
  async updateUserPw(
    @Args('email') email: string,
    @Args('pw') pw: string, //
  ) {
    const hashedPw = await bcrypt.hash(pw, 10);
    await this.joinService.updatePw({
      email,
      pw: hashedPw,
    });
    return '비밀번호 변경 완료성공';
  }

  //@UseGuards(GqlAuthAccessGuard)
  @UseGuards(GqlAuthRefreshGuard)
  @Query(() => Join)
  async fetchUser(
    @CurrentUser() currentUser: any, //
  ) {
    return await this.joinService.findOne({ email: currentUser.email });
  }

  @Query(() => [Join])
  async fetchUsers() {
    return await this.joinService.findAll();
  }

  @Query(() => [Join])
  async fetchAllUser() {
    return await this.joinService.findAllUser();
  }

  @Mutation(() => Join)
  async searchUserEmail(
    @Args('phone') phone: string, //
  ) {
    return this.joinService.emailFindone({ phone });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteUser(
    @CurrentUser() currentUser: any, //
  ) {
    return this.joinService.delete({ email: currentUser.email });
  }
}
