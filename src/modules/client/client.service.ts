import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { ManyOutput } from '../main/global/DTOs/ManyOutput';
import { ManyOpts } from '../main/global/DTOs/Opts';
import { WithManyOpts } from '../main/global/DTOs/WithOpts';
import { getPaginatedResponseFromDB } from '../main/global/funcs/getPaginatedResponseFromDB';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Client } from './client.entity';
import { AppOutput } from './DTO/AppOutput';
import { OAuthHostName } from './oauth-hostname.entity';

@Injectable()
export class ClientService implements OnModuleInit {
  constructor(
    @InjectRepository(Client)
    private ClientRepo: Repository<Client>,
    @InjectRepository(OAuthHostName)
    private HostnameRepo: Repository<OAuthHostName>,
    @Inject(UserService)
    private readonly UserService: UserService,
  ) {}

  async findMany(page: number, limit: number): Promise<WithManyOpts<Client>> {
    const [items, count] = await this.ClientRepo.findAndCount(
      getPaginatedResponseFromDB(limit, page),
    );

    return {
      items,
      opts: {
        count,
        limit,
        page,
      },
    };
  }

  async serialize(client: Client): Promise<AppOutput> {
    return {
      id: client.ClientId,
      name: client.ClientName,
      image_url: ImageService.getUrl(client.ClientImageId),
      hosts: client.Hostnames.map((host) => host.HostName),
    };
  }

  async serializeMany(
    clients: Client[],
    opts: ManyOpts,
  ): Promise<ManyOutput<AppOutput>> {
    const items = await Promise.all(
      clients.map((client) => this.serialize(client)),
    );
    return {
      items,
      count: opts.count,
      limit: opts.limit,
      page: opts.page,
    };
  }

  public getById(id: number) {
    return this.ClientRepo.findOneBy({ ClientId: id });
  }

  public getByIdAndSecret(id: number, secret: string) {
    return this.ClientRepo.findOneBy({ ClientId: id, ClientSecret: secret });
  }

  public async validateHost(hostname: string, client_id: number) {
    const findedHost = await this.HostnameRepo.findOneBy({
      ClientId: client_id,
      HostName: hostname,
    });
    if (findedHost) return true;
    return false;
  }

  public async addHostname(hostname: string, client: Client) {
    const host = new OAuthHostName();

    host.HostName = hostname;
    host.Client = client;
    host.ClientId = client.ClientId;

    await this.HostnameRepo.save(host);

    client.Hostnames = [...client.Hostnames, host];
    return client;
  }

  public async deleteHostname(hostname: string, client: Client) {
    return await this.HostnameRepo.delete({
      HostName: hostname,
      ClientId: client.ClientId,
    });
  }

  public async create(
    data: { name: string; image_id?: number; id?: number },
    user: User,
  ) {
    if (data.id) {
      const client = await this.ClientRepo.findOneBy({ ClientId: data.id });
      if (client) return client;
    }

    const newclient = new Client();

    if (data.id) newclient.ClientId = data.id;
    newclient.ClientName = data.name;
    newclient.User = user;
    newclient.UserId = user.Id;
    newclient.ClientSecret = randomBytes(36).toString('hex');
    newclient.ClientImageId = data.image_id;

    return this.ClientRepo.save(newclient);
  }

  async onModuleInit() {
    const user = await this.UserService.findById(1);
    await this.create({ name: 'Народный Банк Мемов', id: 1 }, user);
  }
}
