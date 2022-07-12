import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserProvider } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AccountModule)],
  providers: [UserService, UserProvider],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
