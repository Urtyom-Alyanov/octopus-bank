import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AccountType } from '../account/account.entity';
import { CurrentAccountRelated } from '../auth/decorators/current-account.decorator';
import { Private } from '../auth/guards/custom-auth.guard';
import { PaginatedQuery } from '../main/global/DTOs/PaginatedQuery';
import { User } from '../user/user.entity';
import { ClientService } from './client.service';
import { CreateAppInput } from './DTO/CreateAppInput';

@Controller({ path: 'methods/applications', version: '2.0a' })
export class ClientController {
  constructor(
    @Inject(ClientService)
    private readonly ClientService: ClientService,
  ) {}

  @Post('/create/')
  @Private({ onlyTypes: [AccountType.User] })
  public async create(
    @CurrentAccountRelated() user: User,
    @Body() CreateAppInput: CreateAppInput,
  ) {
    const client = await this.ClientService.create(CreateAppInput, user);

    return this.ClientService.serialize(client);
  }

  @Get('/find-many/')
  public async findMany(@Query() { limit, page }: PaginatedQuery) {
    const clients = await this.ClientService.findMany(page, limit);

    return this.ClientService.serializeMany(clients.items, clients.opts);
  }

  @Get('/find-by-id/:clientId')
  public async findById(@Param('clientId', ParseIntPipe) client_id: number) {
    const client = await this.ClientService.getById(client_id);

    return this.ClientService.serialize(client);
  }

  @Post('/add-host/:clientId/:hostname')
  @Private({ onlyTypes: [AccountType.User] })
  public async addHost(
    @Param('clientId', ParseIntPipe) client_id: number,
    @Param('hostname') hostname: string,
  ) {
    const clientFinded = await this.ClientService.getById(client_id);
    const client = await this.ClientService.addHostname(hostname, clientFinded);

    return this.ClientService.serialize(client);
  }

  @Delete('/delete-host/:clientId/:hostname')
  @Private({ onlyTypes: [AccountType.User] })
  public async removeHost(
    @Param('clientId', ParseIntPipe) client_id: number,
    @Param('hostname') hostname: string,
  ) {
    const clientFinded = await this.ClientService.getById(client_id);
    await this.ClientService.deleteHostname(hostname, clientFinded);
    const client = await this.ClientService.getById(client_id);

    return this.ClientService.serialize(client);
  }
}
