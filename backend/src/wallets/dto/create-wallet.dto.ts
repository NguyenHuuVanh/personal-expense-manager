import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  cardNumber?: string;

  @IsString()
  @IsOptional()
  bankCode?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  accountHolder?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
