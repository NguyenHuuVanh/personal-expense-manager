import { IsNumber, IsOptional, IsString, IsDateString, IsBoolean, Min, IsEnum } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  categoryId?: string;

  @IsNumber()
  @Min(0)
  budgetAmount: number;

  @IsEnum(['daily', 'weekly', 'monthly'])
  @IsOptional()
  period?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
