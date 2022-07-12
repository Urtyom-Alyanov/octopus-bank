import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCurrencyInputDTO {
  @MinLength(2)
  @MaxLength(5)
  @IsString()
  iso: string;

  @IsString()
  name: string;
}
