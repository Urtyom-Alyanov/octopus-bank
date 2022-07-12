import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';
import { GovController } from './gov.controller';
import { Gov } from './gov.entity';
import { GovService } from './gov.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gov]),
    forwardRef(() => UserModule),
    forwardRef(() => AccountModule),
  ],
  providers: [GovService],
  controllers: [GovController],
  exports: [GovService],
})
export class GovModule {}
