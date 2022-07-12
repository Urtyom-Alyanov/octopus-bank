import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CurrentAccount,
  CurrentAccountRelated,
} from '../auth/decorators/current-account.decorator';
import { Private } from '../auth/guards/custom-auth.guard';
import { AccountService } from './account.service';
import { ICropData } from '@/shared/types/ICropData';
import { ACCOUNT_NOT_FOUND } from './exceptions';
import { Account, AccountType } from './account.entity';
import { Organization } from '../org/org.entity';
import { User } from '../user/user.entity';
import { Gov } from '../gov/gov.entity';
import { FORBIDDEN } from '../auth/exceptions';

@Controller({ path: '/methods/account', version: '2.0a' })
export class AccountController {
  constructor(
    @Inject(AccountService)
    private AccountService: AccountService,
  ) {}

  @Post('avatar-upload')
  @Private()
  @UseInterceptors(FileInterceptor('file'))
  public async AvatarUpload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentAccount() Account: Account,
    @Body() ICropData: ICropData,
    @Query('id') id?: string,
  ) {
    const finded =
      id && parseInt(id)
        ? await this.AccountService.findById(parseInt(id))
        : Account;

    const isChlen = await this.AccountService.validateScope(finded, Account);
    if (!isChlen) throw new ForbiddenException(FORBIDDEN);

    const account = await this.AccountService.uploadAvatar(
      file.buffer,
      finded,
      ICropData,
    );
    if (!account) throw new NotFoundException(ACCOUNT_NOT_FOUND);
    return this.AccountService.serialize(account);
  }

  @Get('me')
  @Private()
  public async MeAccount(@CurrentAccount() Account: Account) {
    return this.AccountService.serialize(Account);
  }

  @Get('me/related')
  @Private()
  public async MeRelatedAccount(
    @CurrentAccountRelated() Related: User | Gov | Organization,
    @CurrentAccount('AccountType') accountType: AccountType,
  ) {
    return this.AccountService.serializeRelated(accountType, Related);
  }

  @Get('find/:tag')
  public async FindByTag(@Param('tag') tag: string) {
    const finded = await this.AccountService.findByTag(tag);
    if (!finded) throw new NotFoundException(ACCOUNT_NOT_FOUND);
    return this.AccountService.serialize(finded);
  }

  @Get('find/:tag/related')
  public async FindByTagRelated(@Param('tag') tag: string) {
    const finded = await this.AccountService.findByTag(tag);
    if (!finded) throw new NotFoundException(ACCOUNT_NOT_FOUND);
    const related = await this.AccountService.findRelated(finded);
    return this.AccountService.serializeRelated(finded.AccountType, related);
  }
}
