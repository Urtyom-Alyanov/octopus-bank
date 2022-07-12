import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ManyOutput } from '../main/global/DTOs/ManyOutput';
import { PaginatedQuery } from '../main/global/DTOs/PaginatedQuery';
import { CurrencyService } from './currency.service';
import { CurrencyOutputDTO } from './DTO/CurrencyOutput';
import { CreateCurrencyInputDTO } from './DTO/CreateCurrencyInput';

@Controller({ path: 'methods/currency', version: '2.0a' })
export class CurrencyController {
  constructor(
    @Inject(CurrencyService)
    private readonly CurrencyService: CurrencyService,
  ) {}

  @Get('find-by-iso/:iso')
  public async findByISO(@Param('iso') iso: string) {
    const currency = await this.CurrencyService.findByISO(iso);
    return this.CurrencyService.serialize(currency);
  }

  @Get('find-many')
  public async findMany(
    @Query() { limit, page }: PaginatedQuery,
  ): Promise<ManyOutput<CurrencyOutputDTO>> {
    const { items, opts } = await this.CurrencyService.findMany(page, limit);
    return this.CurrencyService.serializeMany(items, opts);
  }

  @Post('create')
  public async create(
    @Body() CreateCurrencyInputDTO: CreateCurrencyInputDTO,
  ): Promise<CurrencyOutputDTO> {
    const currency = await this.CurrencyService.findOrCreate({
      isoCode: CreateCurrencyInputDTO.iso,
      name: CreateCurrencyInputDTO.name,
      leuroInOne: Math.random(),
    });
    return this.CurrencyService.serialize(currency);
  }
}
