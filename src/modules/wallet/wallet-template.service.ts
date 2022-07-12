import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletTemplate } from './wallet-template.entity';

@Injectable()
export class WalletTemplateService {
  constructor(
    @InjectRepository(WalletTemplate)
    private readonly WalletTemplateRepo: Repository<WalletTemplate>,
  ) {}

  findById(id: number) {
    return this.WalletTemplateRepo.findOneBy({ Id: id });
  }
}
