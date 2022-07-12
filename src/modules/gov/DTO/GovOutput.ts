import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GovOutput {
  @Expose()
  id: number;

  @Expose()
  account_id: number;

  @Expose()
  user_id: number;

  @Expose()
  card_code: string;

  @Expose()
  only_gov_org: boolean;
}
