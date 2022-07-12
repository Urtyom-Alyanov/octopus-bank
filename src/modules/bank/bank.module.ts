import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgModule } from '../org/org.module';
import { Bank } from './bank.entity';
import { BankService } from './bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank]), forwardRef(() => OrgModule)],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
