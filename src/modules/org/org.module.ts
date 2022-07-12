import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { BankModule } from '../bank/bank.module';
import { GovModule } from '../gov/gov.module';
import { OrgController } from './org.controller';
import { Organization } from './org.entity';
import { OrgService } from './org.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    GovModule,
    forwardRef(() => AccountModule),
    forwardRef(() => BankModule),
  ],
  providers: [OrgService],
  exports: [OrgService],
  controllers: [OrgController],
})
export class OrgModule {}
