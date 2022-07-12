import { IsAlpha, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateGovInput {
  @IsString()
  name: string;
  
  @IsAlpha()
  @IsString()
  tag: string;

  @IsOptional()
  @IsBoolean()
  only_gov: boolean;
}
