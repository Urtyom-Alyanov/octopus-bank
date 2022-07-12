import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateOrgInput {
  @IsNumber()
  gov_id: number;

  @IsBoolean()
  is_gov_org: boolean;

  @IsString()
  org_type: 'bank' | 'org';

  @IsString()
  name: string;

  @IsString()
  tag: string;

  bank_fee?: number;
}
