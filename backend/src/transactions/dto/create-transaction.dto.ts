import { IsString, IsNumber, IsDateString, IsOptional, IsArray, IsEnum, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  walletId: string;

  @IsString()
  categoryId: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  currency?: string;
}
