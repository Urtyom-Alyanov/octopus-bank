import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AccountType } from '../account/account.entity';
import { CurrentAccountRelated } from '../auth/decorators/current-account.decorator';
import { Private } from '../auth/guards/custom-auth.guard';
import { User } from '../user/user.entity';
import { CreateGovInput } from './DTO/CreateGovInput';
import { GovService } from './gov.service';

@Controller({ path: 'methods/gov', version: '2.0a' })
export class GovController {
  constructor(
    @Inject(GovService)
    private readonly GovService: GovService,
  ) {}

  @Get('find/:id')
  public async findById(@Param('id', ParseIntPipe) id: number) {
    const gov = await this.GovService.findByID(id);
    return this.GovService.serialize(gov);
  }

  @Get('find-user/:userId')
  public async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    const gov = await this.GovService.findByUser({ Id: userId });

    return this.GovService.serialize(gov);
  }

  @Post('create')
  @Private({ onlyTypes: [AccountType.User] })
  public async create(
    @Body() CreateGovInput: CreateGovInput,
    @CurrentAccountRelated() user: User,
  ) {
    const gov = await this.GovService.create(CreateGovInput, user);

    return this.GovService.serialize(gov);
  }
}
