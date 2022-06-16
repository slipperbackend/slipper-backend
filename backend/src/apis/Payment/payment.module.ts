import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Join } from '../join/entities/join.entity';
import { Payment } from './payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Join])],
  providers: [PaymentResolver, PaymentService],
})
@Module({})
export class PaymentModule {}
