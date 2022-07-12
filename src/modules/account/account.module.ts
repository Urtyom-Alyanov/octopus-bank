import { Module, NotAcceptableException, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovModule } from '../gov/gov.module';
import { ImageModule } from '../image/image.module';
import { OrgModule } from '../org/org.module';
import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    ImageModule,
    MulterModule.register({
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
          callback(
            new NotAcceptableException({
              errorCode: 401,
              errorText: 'Неверный тип файла',
            }),
            false,
          );
        else callback(null, true);
      },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => OrgModule),
    forwardRef(() => GovModule),
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
