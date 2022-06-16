import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';

import { Join } from './entities/join.entity';
import { JoinResolver } from './join.resolver';
import { JoinService } from './join.service';

@Module({
  imports: [TypeOrmModule.forFeature([Join])],
  providers: [
    JWtAccessStrategy,
    JoinResolver, //
    JoinService,
  ],
})
export class JoinModule {}
