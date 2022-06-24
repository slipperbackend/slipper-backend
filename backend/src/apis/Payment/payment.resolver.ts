import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //
  ) {}

  // 구독권 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Payment])
  async fetchPayments(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ) {
    const result = await this.paymentService.findPayment({
      userId: currentUser.id,
      page,
    });

    return result;
  }

  // 구독권 내역 추가하기
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args('amount', { type: () => Int }) amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.paymentService.create({
      impUid,
      amount,
      currentUser: currentUser.id,
    });
  }

  // 구독권 환불
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async refundPayment(
    @Args('impUid') impUid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.paymentService.refund({
      impUid,
      currentUser: currentUser.id,
    });
  }

  // 구독권 내역 만료시키기
  //@UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updatePayment(
    @Args('userId') userId: string,
    //@CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.paymentService.update({
      userId,
    });

    return result;
  }
}
