import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Scope } from './scope.entity';

@Injectable()
export class ScopeService implements OnModuleInit {
  constructor(
    @InjectRepository(Scope)
    private ScopeRepo: Repository<Scope>,
  ) {}

  findScopes(scopes: string[] | 'any') {
    if (scopes !== 'any') return this.ScopeRepo.findBy({ Name: In(scopes) });
    return this.ScopeRepo.find();
  }

  private async create(name: string) {
    const isCreated = await this.ScopeRepo.findOneBy({ Name: name });
    if (isCreated) return isCreated;

    const scope = new Scope();

    scope.Name = name;

    return this.ScopeRepo.save(scope);
  }

  async onModuleInit() {
    await this.create('payments');
  }

  public async ScopeParseSecondStep(scopes: string[]) {
    const scopesParsed = await this.findScopes(scopes);

    return scopesParsed;
  }

  public async ScopeParseFirstStep(scopes_unparsed: string[] | string) {
    let scopes: string[];
    if (typeof scopes_unparsed === 'string')
      scopes = scopes_unparsed.split(',');
    else scopes = scopes_unparsed;
    const scopesParsed = await this.findScopes(scopes);
    return scopesParsed.map((scope) => scope.Name);
  }
}
